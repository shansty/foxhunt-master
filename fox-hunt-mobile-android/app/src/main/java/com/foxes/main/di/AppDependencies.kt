package com.foxes.main.di

import android.content.Context
import android.content.SharedPreferences
import com.google.gson.Gson
import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import toothpick.InjectConstructor

@InjectConstructor
class AppDependencies(context: Context) {

    private val retrofit = Retrofit.Builder()
        .baseUrl("http://localhost:8083/api/v1/")
        .addConverterFactory(GsonConverterFactory.create())
        .client(OkHttpClient.Builder().build())
        .build()

    val sharedPreferences: SharedPreferences = context.getSharedPreferences(
        "prefs.xml",
        Context.MODE_PRIVATE
    )

    val gson = Gson()
    
    inner class Network {
        fun <S> getApi(apiClass: Class<S>): S = retrofit.create(apiClass)
    }
}
