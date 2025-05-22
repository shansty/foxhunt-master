package com.foxes.main.presentation.base.utils

import android.content.Context
import dalvik.system.DexFile

fun <T> getPackageClasses(
    context: Context,
    packageName: String
): List<Class<T>> {
    val dexFileField = field("dalvik.system.DexPathList\$Element", "dexFile")
    val pathList = field("dalvik.system.BaseDexClassLoader", "pathList").get(context.classLoader)

    return pathList
        .let { field("dalvik.system.DexPathList", "dexElements").get(it) }
        .let { it as? Array<*> }
        ?.map { dex ->
            dexFileField.get(dex) as DexFile
        }?.flatMap { file ->
            file.entries().toList()
        }?.filter {
            it.startsWith(packageName)
        }?.map { className ->
            context.classLoader.loadClass(className) as Class<T>
        } ?: emptyList()
}

private fun field(
    className: String,
    fieldName: String
) = Class.forName(className)
    .getDeclaredField(fieldName)
    .apply { isAccessible = true }