const JobTypeSelect = [
  { value: 'nose-job-rhinoplasty', label: 'Nose Job / Rhinoplasty' },
  {
    value: 'breast-augmentation-boob-job',
    label: 'Breast Augmentation / Boob Job',
  },
  { value: 'breast-lift-mastopexy', label: 'Breast Lift / Mastopexy' },
  {
    value: 'breast-reduction-reduction-mammaplasty',
    label: 'Breast Reduction / Reduction Mammaplasty',
  },
  { value: 'facelift-rhytidectomy', label: 'Facelift / Rhytidectomy' },
  {
    value: 'neck-lift-lower-rhytidectomy',
    label: 'Neck Lift / Lower Rhytidectomy',
  },
  {
    value: 'eyelid-surgery-blepharoplasty',
    label: 'Eyelid Surgery / Blepharoplasty',
  },
  { value: 'brow-lift-forehead-lift', label: 'Brow Lift / Forehead Lift' },
  { value: 'ear-pinning-otoplasty', label: 'Ear Pinning / Otoplasty' },
  { value: 'tummy-tuck-abdominoplasty', label: 'Tummy Tuck / Abdominoplasty' },
  { value: 'liposuction-lipoplasty', label: 'Liposuction / Lipoplasty' },
  { value: 'brazilian-butt-lift-bbl', label: 'Brazilian Butt Lift / BBL' },
  { value: 'buttock-implants', label: 'Buttock Implants' },
  { value: 'thigh-lift-thighplasty', label: 'Thigh Lift / Thighplasty' },
  { value: 'arm-lift-brachioplasty', label: 'Arm Lift / Brachioplasty' },
  { value: 'mommy-makeover', label: 'Mommy Makeover' },
  { value: 'body-lift-belt-lipectomy', label: 'Body Lift / Belt Lipectomy' },
  {
    value: 'hair-transplant-hair-restoration',
    label: 'Hair Transplant / Hair Restoration',
  },
  {
    value: 'chin-augmentation-mentoplasty',
    label: 'Chin Augmentation / Mentoplasty',
  },
  {
    value: 'cheek-implants-malar-augmentation',
    label: 'Cheek Implants / Malar Augmentation',
  },
  { value: 'fat-transfer-fat-grafting', label: 'Fat Transfer / Fat Grafting' },
  {
    value: 'dermal-fillers-soft-tissue-fillers',
    label: 'Dermal Fillers / Soft Tissue Fillers',
  },
  {
    value: 'botox-botulinum-toxin-injections',
    label: 'Botox / Botulinum Toxin Injections',
  },
  {
    value: 'chemical-peel-chemexfoliation',
    label: 'Chemical Peel / Chemexfoliation',
  },
  {
    value: 'laser-skin-resurfacing-laser-peel',
    label: 'Laser Skin Resurfacing / Laser Peel',
  },
  { value: 'microdermabrasion', label: 'Microdermabrasion' },
  {
    value: 'lip-augmentation-lip-enhancement',
    label: 'Lip Augmentation / Lip Enhancement',
  },
  {
    value: 'gynaecomastia-surgery-male-breast-reduction',
    label: 'Gynaecomastia Surgery (Male Breast Reduction)',
  },
  {
    value: 'pectoral-implants-male-chest-implants',
    label: 'Pectoral Implants (Male Chest Implants)',
  },
  {
    value: 'vaginal-rejuvenation-labiaplasty',
    label: 'Vaginal Rejuvenation / Labiaplasty',
  },
  { value: 'scar-revision-surgery', label: 'Scar Revision Surgery' },
  {
    value: 'weight-loss-surgery-bariatric-surgery',
    label: 'Weight Loss Surgery / Bariatric Surgery',
  },
  {
    value: 'skin-tightening-non-surgical',
    label: 'Skin Tightening (Non-Surgical)',
  },
  {
    value: 'non-surgical-rhinoplasty-liquid-nose-job',
    label: 'Non-Surgical Rhinoplasty / Liquid Nose Job',
  },
  { value: 'dermabrasion', label: 'Dermabrasion' },
  {
    value: 'facial-contouring-facial-implants',
    label: 'Facial Contouring / Facial Implants',
  },
  {
    value: 'breast-implant-removal-explant-surgery',
    label: 'Breast Implant Removal / Explant Surgery',
  },
  {
    value: 'brow-lamination-brow-shaping',
    label: 'Brow Lamination / Brow Shaping (semi-permanent)',
  },
  {
    value: 'prp-treatments-platelet-rich-plasma',
    label: 'PRP Treatments / Platelet-Rich Plasma (Hair & Skin)',
  },
  { value: 'mesotherapy', label: 'Mesotherapy' },
  { value: 'thread-lift-pdo-threads', label: 'Thread Lift / PDO Threads' },
  { value: 'neck-liposuction', label: 'Neck Liposuction' },
  { value: 'calf-implants', label: 'Calf Implants' },
  {
    value: 'nipple-correction-inverted-nipple-surgery',
    label: 'Nipple Correction (Inverted Nipple Surgery)',
  },
  { value: 'lower-body-lift', label: 'Lower Body Lift' },
  { value: 'eyebrow-transplant', label: 'Eyebrow Transplant' },
  { value: 'eyelash-transplant', label: 'Eyelash Transplant' },
  { value: 'facial-liposuction', label: 'Facial Liposuction' },
  { value: 'areola-reduction', label: 'Areola Reduction' },
  {
    value: 'hyaluronic-acid-injectables',
    label: 'Hyaluronic Acid Injectables (e.g., Juvederm, Restylane)',
  },
  { value: 'liquid-facelift', label: 'Liquid Facelift' },
  {
    value: 'jawline-contouring',
    label: 'Jawline Contouring (Fillers or surgical)',
  },
  {
    value: 'double-chin-reduction-kybella-injections',
    label: 'Double Chin Reduction / Kybella Injections',
  },
  {
    value: 'coolsculpting-cryolipolysis',
    label: 'CoolSculpting / Cryolipolysis',
  },
  {
    value: 'thermage-radiofrequency-skin-tightening',
    label: 'Thermage (Radiofrequency Skin Tightening)',
  },
  {
    value: 'ultherapy-ultrasound-skin-tightening',
    label: 'Ultherapy (Ultrasound Skin Tightening)',
  },
  { value: 'laser-hair-removal', label: 'Laser Hair Removal' },
  { value: 'tattoo-removal-laser', label: 'Tattoo Removal (Laser)' },
  { value: 'laser-vaginal-tightening', label: 'Laser Vaginal Tightening' },
  {
    value: 'sculptra-injections',
    label: 'Sculptra Injections (for face or buttocks)',
  },
  {
    value: 'radiesse-injections',
    label: 'Radiesse Injections (Calcium hydroxylapatite)',
  },
  {
    value: 'cellulite-treatments',
    label: 'Cellulite Treatments (e.g., Cellfina)',
  },
  {
    value: 'carboxytherapy',
    label: 'Carboxytherapy (for cellulite, scars, etc.)',
  },
  {
    value: 'microneedling-collagen-induction-therapy',
    label: 'Microneedling / Collagen Induction Therapy',
  },
  {
    value: 'dermapen-automated-microneedling',
    label: 'Dermapen / Automated Microneedling',
  },
  { value: 'hydrafacial', label: 'HydraFacial' },
  { value: 'laser-lipolysis-smartlipo', label: 'Laser Lipolysis / Smartlipo' },
  {
    value: 'bichectomy-buccal-fat-removal',
    label: 'Bichectomy / Buccal Fat Removal',
  },
  { value: 'lip-lift', label: 'Lip Lift' },
  {
    value: 'acne-scar-treatments',
    label: 'Acne Scar Treatments (various methods)',
  },
  {
    value: 'tear-trough-fillers',
    label: 'Tear Trough Fillers (Under-Eye Fillers)',
  },
  { value: 'hairline-lowering-surgery', label: 'Hairline Lowering Surgery' },
  {
    value: 'eyebrow-microblading',
    label: 'Eyebrow Microblading (semi-permanent cosmetic procedure)',
  },
  { value: 'buttock-lift-surgical', label: 'Buttock Lift (Surgical)' },
  { value: 'mini-facelift', label: 'Mini Facelift' },
  { value: 'liquid-brow-lift', label: 'Liquid Brow Lift (Injectable)' },
  {
    value: 'jaw-reduction-mandible-contouring',
    label: 'Jaw Reduction (Mandible Contouring)',
  },
  { value: 'dimple-creation-surgery', label: 'Dimple Creation Surgery' },
  {
    value: 'abdominal-etching',
    label: 'Abdominal Etching (high-definition liposuction)',
  },
  {
    value: 'penoplasty-penile-enlargement-surgery',
    label: 'Penoplasty / Penile Enlargement Surgery',
  },
  {
    value: 'lipo-360-circumferential-liposuction',
    label: 'Lipo 360 / Circumferential Liposuction',
  },
  {
    value: 'orthognathic-surgery-jaw-alignment',
    label: 'Orthognathic Surgery / Jaw Alignment',
  },
  {
    value: 'alarplasty-nasal-wing-reduction',
    label: 'Alarplasty (Nasal Wing Reduction)',
  },
  {
    value: 'laser-vein-treatment',
    label: 'Laser Vein Treatment (Spider & Varicose Veins)',
  },
  {
    value: 'ocular-plastic-surgery',
    label: 'Ocular Plastic Surgery (Eye Shape & Function)',
  },
  {
    value: 'cheek-reduction-buccal-fat-pad-excision',
    label: 'Cheek Reduction (Buccal Fat Pad Excision)',
  },
  { value: 'laser-stretch-mark-removal', label: 'Laser Stretch Mark Removal' },
  { value: 'tumescent-liposuction', label: 'Tumescent Liposuction' },
  {
    value: 'earlobe-repair',
    label: 'Earlobe Repair (Split or gauged earlobes)',
  },
  {
    value: 'non-surgical-butt-lift-sculptra-butt-lift',
    label: 'Non-Surgical Butt Lift / Sculptra Butt Lift',
  },
  {
    value: 'vampire-facelift-prp-based',
    label: 'Vampire Facelift (PRP-Based)',
  },
  {
    value: 'transgender-gender-confirmation-surgeries',
    label: 'Transgender / Gender Confirmation Surgeries',
  },
  {
    value: 'abdominal-6-pack-surgery',
    label: 'Abdominal / 6-Pack Surgery (High-Def Sculpting)',
  },
  {
    value: 'rhinophyma-correction',
    label: 'Rhinophyma Correction (for severe rosacea)',
  },
  {
    value: 'scarless-facelift-endoscopic-facelift',
    label: 'Scarless Facelift (Endoscopic Facelift)',
  },
  {
    value: 'laser-assisted-breast-reduction',
    label: 'Laser-Assisted Breast Reduction',
  },
  { value: 'nipple-lift', label: 'Nipple Lift' },
  { value: 'forehead-reduction-surgery', label: 'Forehead Reduction Surgery' },
  {
    value: 'mini-tummy-tuck-partial-abdominoplasty',
    label: 'Mini Tummy Tuck (Partial Abdominoplasty)',
  },
  {
    value: 'laser-skin-whitening-depigmentation-treatments',
    label: 'Laser Skin Whitening / Depigmentation Treatments',
  },
  { value: 'teeth-whitening-bleaching', label: 'Teeth Whitening / Bleaching' },
  {
    value: 'dental-veneers-porcelain-veneers',
    label: 'Dental Veneers / Porcelain Veneers',
  },
  {
    value: 'dental-implants-implant-dentistry',
    label: 'Dental Implants / Implant Dentistry',
  },
  { value: 'dental-crowns-caps', label: 'Dental Crowns (Caps)' },
  { value: 'dental-bridges', label: 'Dental Bridges' },
  { value: 'invisalign-clear-aligners', label: 'Invisalign / Clear Aligners' },
  {
    value: 'traditional-orthodontics-braces',
    label: 'Traditional Orthodontics (Braces)',
  },
  {
    value: 'gum-contouring-gingivoplasty',
    label: 'Gum Contouring / Gingivoplasty',
  },
  {
    value: 'composite-bonding-tooth-bonding',
    label: 'Composite Bonding / Tooth Bonding',
  },
  { value: 'full-mouth-reconstruction', label: 'Full Mouth Reconstruction' },
  {
    value: 'smile-makeover',
    label: 'Smile Makeover (Combination of Veneers, Crowns, Implants, Etc.)',
  },
  { value: 'dental-inlays-onlays', label: 'Dental Inlays / Onlays' },
  {
    value: 'removable-dentures',
    label: 'Removable Dentures (Partial or Full)',
  },
  {
    value: 'snap-on-smile',
    label: 'Snap-on Smile (Temporary cosmetic appliance)',
  },
  {
    value: 'lingual-braces',
    label: 'Lingual Braces (Braces placed behind the teeth)',
  },
  { value: 'laser-gum-depigmentation', label: 'Laser Gum Depigmentation' },
  {
    value: 'periodontal-plastic-surgery',
    label: 'Periodontal Plastic Surgery (Gum Recession Corrections)',
  },
  {
    value: 'gum-lifts-crown-lengthening',
    label: 'Gum Lifts / Crown Lengthening (Improves gum line aesthetics)',
  },
  { value: 'dental-sealants', label: 'Dental Sealants' },
  { value: 'dental-jewelry', label: 'Dental Jewelry / Tooth Gems' },
];

export default JobTypeSelect;
