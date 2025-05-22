package com.foxes.main.presentation.base

import android.view.LayoutInflater
import androidx.viewbinding.ViewBinding

class ViewBindingFactory(
    private val inflater: LayoutInflater,
) {
    fun <T: ViewBinding> instantiate(clazz: Class<out ViewBinding>): T {
        @Suppress("UNCHECKED_CAST")
        return clazz
            .getMethod("inflate", LayoutInflater::class.java)
            .invoke(null, inflater) as T
    }
}