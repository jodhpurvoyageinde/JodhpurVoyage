<?php
/**
 * Jodhpur Voyage - Dynamic Server-Side Meta Injector for React SPA
 * Serves dynamic <title>, <meta description>, <meta keywords>, and OpenGraph tags
 * to web crawlers, search engines, and View Page Source before React hydrates.
 */

$requestUri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
$cleanPath = trim($requestUri, '/');

$indexPath = __DIR__ . '/index.html';
if (!file_exists($indexPath)) {
    http_response_code(404);
    echo "Index file not found";
    exit;
}

$html = file_get_contents($indexPath);

// If root path or static file, serve default index.html
if (empty($cleanPath) || preg_match('/\.(js|css|png|jpg|jpeg|gif|svg|ico|webp|json|txt|xml|map|woff|woff2|ttf|eot)$/i', $cleanPath)) {
    header('Content-Type: text/html; charset=UTF-8');
    echo $html;
    exit;
}

// Function to safely fetch API with short timeout and local caching
function fetchApiData($url) {
    $cacheDir = sys_get_temp_dir() . '/jv_seo_cache';
    if (!is_dir($cacheDir)) {
        @mkdir($cacheDir, 0777, true);
    }
    $cacheFile = $cacheDir . '/' . md5($url) . '.json';
    
    // 10 minutes cache TTL
    if (file_exists($cacheFile) && (time() - filemtime($cacheFile) < 600)) {
        $cached = @file_get_contents($cacheFile);
        if ($cached) {
            $data = json_decode($cached, true);
            if ($data) return $data;
        }
    }

    $ctx = stream_context_create([
        'http' => [
            'timeout' => 3.0,
            'ignore_errors' => true,
            'header' => "User-Agent: JodhpurVoyage-SSREngine/1.0\r\nAccept: application/json\r\n"
        ],
        'ssl' => [
            'verify_peer' => false,
            'verify_peer_name' => false
        ]
    ]);

    $response = @file_get_contents($url, false, $ctx);
    if ($response) {
        $data = json_decode($response, true);
        if ($data && !isset($data['message'])) {
            @file_put_contents($cacheFile, $response);
            return $data;
        }
    }
    return null;
}

$apiUrl = "https://jodhpurvoyage.onrender.com/api";
$metaTitle = null;
$metaDesc = null;
$metaKeywords = null;
$metaImage = null;

// 1. Destination Route (/destinations/:slug or /destination-rajasthan)
if (preg_match('/^destinations\/([^\/]+)/i', $cleanPath, $m) || $cleanPath === 'destination-rajasthan') {
    $destSlug = isset($m[1]) ? $m[1] : 'rajasthan';
    $destData = fetchApiData("$apiUrl/destinations/" . urlencode($destSlug));
    if ($destData) {
        $metaTitle = !empty($destData['seoTitle']) ? $destData['seoTitle'] : (!empty($destData['metaTitle']) ? $destData['metaTitle'] : "Voyage au " . ($destData['name'] ?? 'Rajasthan') . " — Circuits & Séjours sur Mesure | Jodhpur Voyage");
        $metaDesc = !empty($destData['seoDescription']) ? $destData['seoDescription'] : (!empty($destData['metaDescription']) ? $destData['metaDescription'] : ($destData['shortDescription'] ?? ''));
        $metaKeywords = !empty($destData['seoKeywords']) ? $destData['seoKeywords'] : (!empty($destData['metaKeywords']) ? $destData['metaKeywords'] : "voyage " . strtolower($destData['name'] ?? '') . ", circuit rajasthan, sejour inde");
        $metaImage = !empty($destData['image']) ? $destData['image'] : '/images/dest-rajasthan.jpg';
    }
}
// 2. Blog Route (/blog/:slug)
elseif (preg_match('/^blog\/([^\/]+)/i', $cleanPath, $m)) {
    $blogSlug = $m[1];
    $blogData = fetchApiData("$apiUrl/blogs/" . urlencode($blogSlug));
    if ($blogData) {
        $metaTitle = !empty($blogData['seoTitle']) ? $blogData['seoTitle'] : (($blogData['title'] ?? 'Blog') . " | Jodhpur Voyage");
        $metaDesc = !empty($blogData['seoDescription']) ? $blogData['seoDescription'] : ($blogData['excerpt'] ?? ($blogData['summary'] ?? ''));
        $metaKeywords = !empty($blogData['seoKeywords']) ? $blogData['seoKeywords'] : "blog voyage inde, conseils inde, jodhpur voyage";
        $metaImage = !empty($blogData['image']) ? $blogData['image'] : '/images/dest-rajasthan.jpg';
    }
}
// 3. Tour Route (/:slug or /tours/:slug)
else {
    $tourSlug = preg_replace('/^tours\//', '', $cleanPath);
    $tourData = fetchApiData("$apiUrl/tours/" . urlencode($tourSlug));
    if ($tourData) {
        $metaTitle = !empty($tourData['seoTitle']) ? $tourData['seoTitle'] : (!empty($tourData['metaTitle']) ? $tourData['metaTitle'] : ($tourData['title'] ?? 'Circuit') . " — Circuit Privé | Jodhpur Voyage");
        $metaDesc = !empty($tourData['seoDescription']) ? $tourData['seoDescription'] : (!empty($tourData['metaDescription']) ? $tourData['metaDescription'] : (!empty($tourData['subtitle']) ? $tourData['subtitle'] : "Découvrez le circuit " . ($tourData['title'] ?? '')));
        $metaKeywords = !empty($tourData['seoKeywords']) ? $tourData['seoKeywords'] : (!empty($tourData['metaKeywords']) ? $tourData['metaKeywords'] : strtolower($tourData['title'] ?? '') . ", voyage inde, circuit rajasthan");
        $metaImage = !empty($tourData['image']) ? $tourData['image'] : '/images/dest-rajasthan.jpg';
    } else {
        // Check Custom URL endpoint
        $customData = fetchApiData("$apiUrl/seo/by-path?path=" . urlencode('/' . $cleanPath));
        if ($customData) {
            $metaTitle = $customData['title'] ?? null;
            $metaDesc = $customData['description'] ?? null;
            $metaKeywords = $customData['keywords'] ?? null;
            $metaImage = $customData['ogImage'] ?? null;
        }
    }
}

// If dynamic metadata found, replace in HTML
if ($metaTitle) {
    $safeTitle = htmlspecialchars(trim($metaTitle), ENT_QUOTES, 'UTF-8');
    $html = preg_replace('/<title>.*?<\/title>/s', "<title>{$safeTitle}</title>", $html);
    $html = preg_replace('/<meta property="og:title" content=".*?" \/>/s', "<meta property=\"og:title\" content=\"{$safeTitle}\" />", $html);
    $html = preg_replace('/<meta name="twitter:title" content=".*?" \/>/s', "<meta name=\"twitter:title\" content=\"{$safeTitle}\" />", $html);
}

if ($metaDesc) {
    $safeDesc = htmlspecialchars(trim(strip_tags($metaDesc)), ENT_QUOTES, 'UTF-8');
    $html = preg_replace('/<meta name="description" content=".*?" \/>/s', "<meta name=\"description\" content=\"{$safeDesc}\" />", $html);
    $html = preg_replace('/<meta property="og:description" content=".*?" \/>/s', "<meta property=\"og:description\" content=\"{$safeDesc}\" />", $html);
    $html = preg_replace('/<meta name="twitter:description" content=".*?" \/>/s', "<meta name=\"twitter:description\" content=\"{$safeDesc}\" />", $html);
}

if ($metaKeywords) {
    $safeKeywords = htmlspecialchars(trim($metaKeywords), ENT_QUOTES, 'UTF-8');
    $html = preg_replace('/<meta name="keywords" content=".*?" \/>/s', "<meta name=\"keywords\" content=\"{$safeKeywords}\" />", $html);
}

if ($metaImage) {
    $safeImage = htmlspecialchars(trim($metaImage), ENT_QUOTES, 'UTF-8');
    $html = preg_replace('/<meta property="og:image" content=".*?" \/>/s', "<meta property=\"og:image\" content=\"{$safeImage}\" />", $html);
    $html = preg_replace('/<meta name="twitter:image" content=".*?" \/>/s', "<meta name=\"twitter:image\" content=\"{$safeImage}\" />", $html);
}

// Canonical
$canonicalUrl = "https://jodhpurvoyage.com/" . ltrim($cleanPath, '/');
$html = preg_replace('/<link rel="canonical" href=".*?" \/>/s', "<link rel=\"canonical\" href=\"{$canonicalUrl}\" />", $html);

header('Content-Type: text/html; charset=UTF-8');
echo $html;
exit;
