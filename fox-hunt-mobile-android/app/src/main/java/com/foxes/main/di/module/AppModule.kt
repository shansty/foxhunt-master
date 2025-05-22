package com.foxes.main.di.module

import android.content.ContentResolver
import android.content.Context
import android.content.SharedPreferences
import android.location.LocationManager
import android.media.AudioManager
import android.os.Looper
import androidx.core.content.getSystemService
import androidx.fragment.app.FragmentFactory
import androidx.viewbinding.ViewBinding
import com.foxes.main.data.api.CompetitionsApi
import com.foxes.main.data.api.GameResultApi
import com.foxes.main.data.api.LoginApi
import com.foxes.main.di.provider.*
import com.foxes.main.presentation.base.AppFragmentFactory
import com.foxes.main.presentation.base.ViewBindingFactory
import com.foxes.main.presentation.base.utils.getPackageClasses
import com.google.gson.Gson
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import toothpick.ktp.binding.bind
import toothpick.ktp.binding.module

fun appModule(
    context: Context,
    viewBindingFactory: ViewBindingFactory,
) = module {
    bind<Context>().toInstance { context }
    bind<LoginApi>().toProvider(LoginApiProvider::class)
    bind<CompetitionsApi>().toProvider(CompetitionsApiProvider::class)
    bind<SharedPreferences>().toProvider(SharedPreferencesProvider::class)
    bind<Gson>().toProvider(GsonProvider::class)
    bind<FragmentFactory>().toClass(AppFragmentFactory::class)
    bind<LocationManager>().toInstance { context.getSystemService()!! }
    bind<AudioManager>().toInstance { context.getSystemService()!! }
    bind<Looper>().toInstance { Looper.getMainLooper() }
    bind<ContentResolver>().toInstance { context.contentResolver }
    bind<GameResultApi>().toProvider(GameResultApiProvider::class)
    bind<CoroutineScope>().toProviderInstance { CoroutineScope(Dispatchers.Main) }

    getPackageClasses<ViewBinding>(context, "com.foxes.databinding").onEach { clazz ->
        bind(clazz).toProviderInstance { viewBindingFactory.instantiate(clazz) }
    }
}