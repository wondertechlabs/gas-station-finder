Pod::Spec.new do |s|
  s.name           = 'MapKitSearch'
  s.version        = '1.0.0'
  s.summary        = 'Búsqueda de puntos de interés con MapKit'
  s.description    = 'Busca gasolineras cercanas con MKLocalPointsOfInterestRequest.'
  s.author         = ''
  s.homepage       = 'https://docs.expo.dev/modules/'
  s.platforms      = { :ios => '16.4' }
  s.source         = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'
  s.frameworks = 'MapKit'

  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
  }

  s.source_files = '**/*.{h,m,mm,swift}'
end
