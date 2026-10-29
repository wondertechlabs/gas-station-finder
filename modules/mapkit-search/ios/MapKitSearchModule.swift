import ExpoModulesCore
import MapKit

struct PointOfInterestRecord: Record {
  @Field var id: String = ""
  @Field var name: String = ""
  @Field var address: String?
  /// Código ISO del país (p. ej. "NI"), para no mezclar países vecinos.
  @Field var countryCode: String?
  /// Departamento según el sistema, en el idioma del dispositivo (p. ej. "Leon").
  @Field var administrativeArea: String?
  @Field var latitude: Double = 0
  @Field var longitude: Double = 0
}

public class MapKitSearchModule: Module {
  public func definition() -> ModuleDefinition {
    Name("MapKitSearch")

    // Gasolineras dentro de una región, sin API key: usa el índice de Apple Maps.
    // MapKit devuelve como máximo 25 resultados por búsqueda, sin importar el tamaño
    // de la región; quien llama subdivide las regiones saturadas.
    AsyncFunction("searchGasStationsInRegion") {
      (latitude: Double, longitude: Double, latitudeDelta: Double, longitudeDelta: Double)
        async throws -> [PointOfInterestRecord] in
      let request = MKLocalSearch.Request()

      request.naturalLanguageQuery = "gasolinera"
      request.resultTypes = .pointOfInterest
      request.pointOfInterestFilter = MKPointOfInterestFilter(including: [.gasStation])
      request.region = MKCoordinateRegion(
        center: CLLocationCoordinate2D(latitude: latitude, longitude: longitude),
        span: MKCoordinateSpan(latitudeDelta: latitudeDelta, longitudeDelta: longitudeDelta)
      )
      // Sin esto MapKit puede devolver resultados fuera de la región (iOS 18+).
      if #available(iOS 18.0, *) {
        request.regionPriority = .required
      }

      do {
        let response = try await MKLocalSearch(request: request).start()
        return response.mapItems.map(Self.record(from:))
      } catch let error as MKError where error.code == .loadingThrottled {
        // MapKit limita las búsquedas por minuto: JS reintenta más tarde.
        throw Exception(
          name: "MapKitThrottled",
          description: "MapKit limitó las búsquedas, reintenta más tarde",
          code: "ERR_MAPKIT_THROTTLED"
        )
      } catch let error as MKError where error.code == .placemarkNotFound {
        return []
      }
    }
  }

  private static func record(from item: MKMapItem) -> PointOfInterestRecord {
    let coordinate: CLLocationCoordinate2D
    let address: String?
    let countryCode: String?
    let administrativeArea: String?

    if #available(iOS 26.0, *) {
      coordinate = item.location.coordinate
      address =
        item.addressRepresentations?.fullAddress(includingRegion: false, singleLine: true)
        ?? item.address?.shortAddress

      countryCode = item.addressRepresentations?.region?.identifier
      administrativeArea = Self.administrativeArea(from: item.addressRepresentations)
    } else {
      coordinate = item.placemark.coordinate
      address = item.placemark.title
      countryCode = item.placemark.countryCode
      administrativeArea = item.placemark.administrativeArea
    }

    var record = PointOfInterestRecord()
    record.id = Self.identifier(for: item, coordinate: coordinate)
    record.name = item.name ?? "Gasolinera"
    record.address = address
    record.countryCode = countryCode
    record.administrativeArea = administrativeArea
    record.latitude = coordinate.latitude
    record.longitude = coordinate.longitude

    return record
  }

  // iOS 26 ya no expone `administrativeArea`: `cityWithContext` da "Bluefields, Southern
  // Atlantic Region", o solo "Matagalpa" cuando la ciudad se llama igual que el departamento.
  @available(iOS 26.0, *)
  private static func administrativeArea(from address: MKAddressRepresentations?) -> String? {
    guard let address else { return nil }
    if let context = address.cityWithContext, let last = context.components(separatedBy: ", ").last,
      context.contains(", ") {
      return last
    }
    
    return address.cityName
  }

  // El identificador estable de Apple Maps solo existe desde iOS 18.
  private static func identifier(for item: MKMapItem, coordinate: CLLocationCoordinate2D) -> String {
    if #available(iOS 18.0, *), let identifier = item.identifier {
      return identifier.rawValue
    }
    
    return "\(coordinate.latitude),\(coordinate.longitude)"
  }
}
