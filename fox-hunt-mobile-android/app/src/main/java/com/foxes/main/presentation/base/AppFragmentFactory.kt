package com.foxes.main.presentation.base

import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentFactory
import com.foxes.main.di.Scope
import com.foxes.main.presentation.game.GameFragment
import toothpick.ktp.KTP

class AppFragmentFactory : FragmentFactory() {

    override fun instantiate(classLoader: ClassLoader, className: String): Fragment {
        return runCatching {
            Class.forName(className).let { clazz ->
                resolveScope(clazz).getInstance(clazz) as Fragment
            }
        }.recover { initialError ->
            runCatching {
                super.instantiate(classLoader, className)
            }.getOrNull() ?: throw initialError
        }.getOrThrow()
    }

    private fun resolveScope(clazz: Class<*>?) =
        if (clazz == GameFragment::class.java) {
            KTP.openScope(Scope.GAME)
        } else {
            KTP.openRootScope()
        }
}