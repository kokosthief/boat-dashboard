ALTER TABLE public.haulout_yards
  ADD COLUMN IF NOT EXISTS rating INTEGER DEFAULT 0;

CREATE INDEX IF NOT EXISTS haulout_yards_rating_idx
  ON public.haulout_yards(rating DESC);

UPDATE public.haulout_yards
SET rating = CASE lower(name)
  WHEN 'schouten' THEN 100
  WHEN 'schouten scheepswerf' THEN 100
  WHEN 'multiship holland' THEN 96
  WHEN 'amsterdam yacht service' THEN 94
  WHEN 'waterland' THEN 88
  WHEN 'straalbedrijf waterland' THEN 88
  WHEN 'braspenning' THEN 86
  WHEN 'scheepswerf van laar' THEN 82
  WHEN 'van laar' THEN 82
  WHEN 'jachtwerf weesp' THEN 78
  WHEN 'scheepswerf de ijwerf' THEN 76
  WHEN 'ijwerf' THEN 76
  WHEN 'werf brouwer' THEN 74
  WHEN 'brouwer' THEN 74
  WHEN 'overwijk metaalbewerking' THEN 72
  WHEN 'scheepswerf borsch' THEN 68
  WHEN 'teerenstra' THEN 60
  WHEN 'zaanhaven/westhaven' THEN 55
  WHEN 'marina seaport ijmuiden' THEN 50
  WHEN 'offertehaven.nl' THEN 45
  WHEN 'nautisch centrum nicolaas witsen' THEN 42
  WHEN 'nauticadam / werf twellegea' THEN 40
  WHEN 'scheepswerf de rietpol' THEN 38
  WHEN 'scheepswerf stella maris' THEN 35
  WHEN 'kalfsvel' THEN 34
  WHEN 'nautix marina' THEN 30
  WHEN 'marina realeneiland' THEN 28
  WHEN 'jachtwerf kokernoot' THEN 26
  WHEN 'damen shiprepair amsterdam' THEN 25
  WHEN 'kadoelenwerf jachtservice' THEN 20
  WHEN 'kadoelen wharf' THEN 20
  WHEN 'coöp werf de zuiderzee' THEN 18
  WHEN 'jachthaven d'' anckerplaets' THEN 18
  WHEN 'jachthaven het jacht' THEN 16
  WHEN 'jachthaven bouwmeester' THEN 15
  WHEN 'port entrepot' THEN 14
  WHEN 'stichting botenloods de levant' THEN 14
  WHEN 'jachthaven de vlonder' THEN 12
  WHEN 'jachthaven schellingwoude' THEN 12
  WHEN 'sloepdelen loosdrecht' THEN 12
  WHEN 'watersportvereniging de remming' THEN 12
  WHEN 'boatcaptain jachtservice' THEN 10
  WHEN 'jachthaven ''t einde' THEN 10
  WHEN 'jachthaven de vioolsleutel' THEN 8
  WHEN 'jachthaven nauerna' THEN 8
  WHEN 'klaas mulder jachtbouw b.v.' THEN 8
  WHEN 'jachthaven bovendiep (+ mb jachtservice)' THEN 6
  WHEN 'bijdam watersport' THEN 6
  WHEN 'werf rhebergen' THEN 5
  WHEN 'rhebergen' THEN 5
  ELSE rating
END
WHERE rating IS NULL
   OR rating = 0
   OR lower(name) IN (
    'schouten',
    'schouten scheepswerf',
    'multiship holland',
    'amsterdam yacht service',
    'waterland',
    'straalbedrijf waterland',
    'braspenning',
    'scheepswerf van laar',
    'van laar',
    'jachtwerf weesp',
    'scheepswerf de ijwerf',
    'ijwerf',
    'werf brouwer',
    'brouwer',
    'overwijk metaalbewerking',
    'scheepswerf borsch',
    'teerenstra',
    'zaanhaven/westhaven',
    'marina seaport ijmuiden',
    'offertehaven.nl',
    'nautisch centrum nicolaas witsen',
    'nauticadam / werf twellegea',
    'scheepswerf de rietpol',
    'scheepswerf stella maris',
    'kalfsvel',
    'nautix marina',
    'marina realeneiland',
    'jachtwerf kokernoot',
    'damen shiprepair amsterdam',
    'bijdam watersport',
    'kadoelenwerf jachtservice',
    'kadoelen wharf',
    'coöp werf de zuiderzee',
    'jachthaven d'' anckerplaets',
    'jachthaven het jacht',
    'jachthaven bouwmeester',
    'port entrepot',
    'stichting botenloods de levant',
    'jachthaven de vlonder',
    'jachthaven schellingwoude',
    'sloepdelen loosdrecht',
    'watersportvereniging de remming',
    'boatcaptain jachtservice',
    'jachthaven ''t einde',
    'jachthaven de vioolsleutel',
    'jachthaven nauerna',
    'klaas mulder jachtbouw b.v.',
    'jachthaven bovendiep (+ mb jachtservice)',
    'werf rhebergen',
    'rhebergen'
   );
