const EURASIA_API_URL = 'https://script.google.com/macros/s/AKfycbzAxjUQ83CYn0UBkLTBMRzeBOJUsRizlj_LUi0f3buSDNHshCvNdnj6N4SwySzyqAcNtQ/exec';
const BELGRADE_API_URL = "https://script.google.com/macros/s/AKfycbzeQuDcUKer8YJd2dY6TxLSu3qAunHUZIFuVtqe-Ml81pu8KR3CINlIzu2yb8lvud0o/exec";
const branchFromUrl = new URLSearchParams(window.location.search).get('fixedBranch')?.toUpperCase();
if (['EURASIA', 'BELGRADE'].includes(branchFromUrl)) {
    localStorage.setItem('fixedBranch', branchFromUrl);
}
const fixedBranch = localStorage.getItem('fixedBranch');
const API_URL = fixedBranch === 'BELGRADE' ? BELGRADE_API_URL : EURASIA_API_URL;

const contacts = {
    telegram: "https://t.me/+38162389638",
    viber: "https://invite.viber.com/?g2=AQASZejnvCaReVay22AlJNkH965hZ67J2LVqYAL73SnJddt9aaEtZOX9dOJsNAfz",
    whatsapp: "https://wa.me/message/E3PIYL2X2SPFN1",
    instagram: "https://www.instagram.com/kaola_bubbletea?igsh=eWo4aW0yMDF4NHVq&utm_source=qr",
    facebook: "https://www.facebook.com/share/1eYa3f3ZNT/?mibextid=wwXIfr",
    tiktok: "https://www.tiktok.com/@kaolabubbletea?_r=1&_t=ZS-97fzIjCoIbw",
    email: "mailto:kaolabubbletea@outlook.com"
}