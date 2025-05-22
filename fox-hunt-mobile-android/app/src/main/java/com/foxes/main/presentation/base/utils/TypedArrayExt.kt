package com.foxes.main.presentation.base.utils

import android.content.res.TypedArray

inline fun <T : TypedArray?, R> T.use(block: (T) -> R): R {
    var exception: Throwable? = null
    try {
        return block(this)
    } catch (e: Throwable) {
        exception = e
        throw e
    } finally {
        this.closeFinally(exception)
    }
}

fun TypedArray?.closeFinally(cause: Throwable?) = when {
    this == null -> {}
    cause == null -> recycle()
    else ->
        try {
            recycle()
        } catch (closeException: Throwable) {
            cause.addSuppressed(closeException)
        }
}