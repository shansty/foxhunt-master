package com.foxes.main.data.datasource

import android.annotation.SuppressLint
import android.location.LocationManager
import android.os.Looper
import androidx.core.location.LocationManagerCompat
import androidx.core.location.LocationRequestCompat
import com.foxes.main.domain.Coordinate
import kotlinx.coroutines.flow.MutableSharedFlow
import toothpick.InjectConstructor

@InjectConstructor
class LocationDataSource(
    private val locationManager: LocationManager,
    private val looper: Looper,
) {
    val userCoordinates = MutableSharedFlow<Coordinate>(1, 1)

    @SuppressLint("MissingPermission")
    fun onPermissionsGranted() {
        LocationManagerCompat.requestLocationUpdates(
            locationManager, "gps", LocationRequestCompat.Builder(2000).build(),
            {
                userCoordinates.tryEmit(Coordinate(it.latitude, it.longitude))
            },
            looper,
        )
    }
}