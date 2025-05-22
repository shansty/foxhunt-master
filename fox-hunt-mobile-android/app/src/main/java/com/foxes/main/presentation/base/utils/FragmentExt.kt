package com.foxes.main.presentation.base.utils

import androidx.fragment.app.Fragment

inline fun <reified T> Fragment.findParentFragment(): Fragment? {
    var nextParent = parentFragment
    while (nextParent !is T && nextParent != null) {
        nextParent = nextParent.parentFragment
    }
    return nextParent
}