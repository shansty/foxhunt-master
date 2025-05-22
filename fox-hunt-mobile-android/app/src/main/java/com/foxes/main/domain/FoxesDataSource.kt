package com.foxes.main.domain

interface FoxesDataSource {
    fun getFoxes(): List<Fox>
}