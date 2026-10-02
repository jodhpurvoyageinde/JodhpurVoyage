import mongoose from 'mongoose';

const megaMenuItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  link: { type: String, required: true },
  image: { type: String, default: '' },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { _id: false });

const subLinkSchema = new mongoose.Schema({
  label: { type: String, required: true },
  path: { type: String, required: true },
  icon: { type: String, default: 'fas fa-chevron-right' }
}, { _id: false });

const infoColumnSchema = new mongoose.Schema({
  title: { type: String, required: true },
  icon: { type: String, default: 'fas fa-info-circle' },
  links: [subLinkSchema]
}, { _id: false });

const featuredCardSchema = new mongoose.Schema({
  image: { type: String, default: '' },
  tag: { type: String, default: '' },
  title: { type: String, default: '' },
  buttonText: { type: String, default: 'Explorer' },
  buttonLink: { type: String, default: '#' }
}, { _id: false });

const helpCardSchema = new mongoose.Schema({
  title: { type: String, default: 'Des questions ?' },
  description: { type: String, default: 'Nos conseillers francophones répondent à toutes vos interrogations.' },
  buttonText: { type: String, default: 'Nous contacter' },
  buttonLink: { type: String, default: '/contact' }
}, { _id: false });

const megaMenuSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, default: 'main_mega_menu' },
  topBar: {
    email: { type: String, default: 'Info@jodhpurvoyage.com' },
    phone: { type: String, default: '+91-96 50 69 86 69' },
    announcementPrefix: { type: String, default: 'Voyager en confiance :' },
    announcementText: { type: String, default: 'devis gratuit & conseils sur mesure' },
    announcementLink: { type: String, default: '/voyage-sur-mesure' },
    tripAdvisorUrl: { type: String, default: '' },
    trustpilotUrl: { type: String, default: '' },
    googleReviewsUrl: { type: String, default: '' },
    facebookUrl: { type: String, default: '' },
    instagramUrl: { type: String, default: '' },
    twitterUrl: { type: String, default: '' }
  },
  aboutMenu: {
    headerText: { type: String, default: 'CRÉATEUR DES PLUS BEAUX' },
    headerHighlight: { type: String, default: 'VOYAGES DEPUIS 20+ ANS' },
    items: [megaMenuItemSchema]
  },
  destinationsMenu: {
    useDynamicFromDb: { type: Boolean, default: true },
    featuredCard: featuredCardSchema
  },
  surMesureMenu: {
    title: { type: String, default: 'Créez Votre Voyage Personnalisé' },
    icon: { type: String, default: 'fas fa-sliders-h' },
    description: { type: String, default: 'Exprimez vos envies et nous concevrons un itinéraire unique, adapté à vos dates, votre rythme et votre budget.' },
    links: [subLinkSchema],
    featuredCard: featuredCardSchema
  },
  infosMenu: {
    columns: [infoColumnSchema],
    helpCard: helpCardSchema
  },
  inspirationMenu: {
    headerText: { type: String, default: 'LE VOYAGE SELON' },
    headerHighlight: { type: String, default: 'VOS ENVIES' },
    items: [megaMenuItemSchema]
  }
}, {
  timestamps: true,
  collection: 'megamenus'
});

const MegaMenu = mongoose.model('MegaMenu', megaMenuSchema);

export default MegaMenu;
