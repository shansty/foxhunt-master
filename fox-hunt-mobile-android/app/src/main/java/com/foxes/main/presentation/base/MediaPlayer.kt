package com.foxes.main.presentation.base

import android.content.Context
import android.media.MediaPlayer.OnCompletionListener
import android.media.MediaPlayer as AndroidMediaPlayer

class MediaPlayer private constructor(
    private val mContext: Context,
    private val mResId: Int,
) {
    private var mCurrentPlayer = AndroidMediaPlayer.create(mContext, mResId)
    private var mNextPlayer = AndroidMediaPlayer.create(mContext, mResId)

    private fun createNextMediaPlayer() {
        mNextPlayer = AndroidMediaPlayer.create(mContext, mResId)
        mCurrentPlayer.setNextMediaPlayer(mNextPlayer)
        mCurrentPlayer.setOnCompletionListener(onCompletionListener)
    }

    private val onCompletionListener =
        OnCompletionListener { mediaPlayer ->
            mediaPlayer.release()
            mCurrentPlayer = mNextPlayer
            createNextMediaPlayer()
        }

    init {
        mCurrentPlayer
        createNextMediaPlayer()
    }

    fun start() {
        mCurrentPlayer.start()
    }

    fun pause() {
        mCurrentPlayer.pause()
    }

    fun setVolume(leftVolume: Float, rightVolume: Float) {
        mCurrentPlayer.setVolume(leftVolume, rightVolume)
        mNextPlayer.setVolume(leftVolume, rightVolume)
    }

    companion object {
        fun create(
            context: Context,
            resId: Int
        ): MediaPlayer = MediaPlayer(context, resId)
    }
}