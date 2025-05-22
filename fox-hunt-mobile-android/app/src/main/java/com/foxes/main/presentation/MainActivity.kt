package com.foxes.main.presentation

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.foxes.R
import com.foxes.main.di.module.appModule
import com.foxes.main.di.module.gameModule
import com.foxes.main.presentation.base.AppFragmentFactory
import com.foxes.main.presentation.base.ViewBindingFactory
import toothpick.Toothpick
import toothpick.ktp.KTP

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        supportFragmentManager.fragmentFactory = AppFragmentFactory()
        val validInstanceState = validateInstanceState(savedInstanceState)
        KTP.openRootScope().installModules(
            appModule(applicationContext, ViewBindingFactory(layoutInflater)),
            gameModule(),
        )
        super.onCreate(validInstanceState)
        setContentView(R.layout.activity_main)
    }

    private fun validateInstanceState(savedInstanceState: Bundle?) = if (
        savedInstanceState != null && !KTP.isScopeOpen(Toothpick::class.java)
    ) {
        null
    } else {
        savedInstanceState
    }
}