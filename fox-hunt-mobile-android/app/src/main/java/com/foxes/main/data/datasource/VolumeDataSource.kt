package com.foxes.main.data.datasource

import android.content.ContentResolver
import android.database.ContentObserver
import android.media.AudioManager
import android.os.Handler
import android.os.Looper
import android.provider.Settings
import kotlinx.coroutines.flow.MutableStateFlow
import toothpick.InjectConstructor
import javax.inject.Singleton

@Singleton
@InjectConstructor
class VolumeDataSource(
    contentResolver: ContentResolver,
    private val looper: Looper,
    private val audioManager: AudioManager,
) {
    private val volume: Int
        get() = audioManager.getStreamVolume(AudioManager.STREAM_MUSIC)

    val volumeFlow = MutableStateFlow(volume)

    init {
        contentResolver.registerContentObserver(Settings.System.CONTENT_URI, true,
            object : ContentObserver(Handler(looper)) {
                override fun onChange(selfChange: Boolean) {
                    super.onChange(selfChange)
                    volumeFlow.tryEmit(volume)
                }
            }
        )
    }

    fun setVolume(value: Int) {
        audioManager.setStreamVolume(AudioManager.STREAM_MUSIC, value, 0)
    }
}