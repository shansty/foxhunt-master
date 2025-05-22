package com.foxes.main.presentation.game

import android.Manifest
import android.content.Context
import android.os.Bundle
import android.view.View
import androidx.activity.result.contract.ActivityResultContracts
import androidx.annotation.RawRes
import androidx.appcompat.app.AlertDialog
import androidx.compose.runtime.collectAsState
import androidx.navigation.fragment.findNavController
import com.foxes.R
import com.foxes.databinding.FragmentGameBinding
import com.foxes.main.domain.Fox
import com.foxes.main.presentation.BottomNavigationFragment
import com.foxes.main.presentation.BottomNavigationFragmentDirections
import com.foxes.main.presentation.base.BaseFragment
import com.foxes.main.presentation.base.MediaPlayer
import com.foxes.main.presentation.base.utils.findParentFragment
import com.foxes.main.presentation.base.utils.observeFlow
import com.foxes.main.presentation.base.utils.use
import toothpick.InjectConstructor

@InjectConstructor
class GameFragment(
    override val viewModel: GameViewModel,
    override val viewBinding: FragmentGameBinding,
) : BaseFragment() {

    private val foxPlayers = mutableMapOf<Fox, MediaPlayer>()
    private val noisePlayer: MediaPlayer

    init {
        viewBinding.run {
            finish.setOnClickListener {
                findParentFragment<BottomNavigationFragment>()
                    ?.findNavController()
                    ?.navigate(
                        BottomNavigationFragmentDirections.actionBottomNavigationFragmentToResultFragment()
                    )
            }
            viewModel.volume.observeFlow(this@GameFragment) { volumeStep ->
                sliderVolume.value = volumeStep.toFloat()
                volume.text = volumeStep.toString()
            }
            sliderVolume.addOnChangeListener { _, value, fromUser ->
                if (fromUser) {
                    viewModel.setVolume(value)
                }
            }
            viewModel.frequencyRange.observeFlow(this@GameFragment){ (from, to) ->
                sliderFrequency.valueFrom = from
                sliderFrequency.valueTo = to
                sliderFrequency.value = from
            }
            fun initPlayer(
                @RawRes resId: Int
            ) = MediaPlayer.create(viewBinding.root.context, resId)
                .apply {
                    start()
                    pause()
                }
            noisePlayer = initPlayer(R.raw.white_noise)
            viewModel.foxSignalFound.observeFlow(this@GameFragment, ::playSound)
            viewModel.foxes.observeFlow(this@GameFragment) { foxes ->
                val players = viewBinding.root.resources.obtainTypedArray(R.array.fox_sounds).use { sounds ->
                    (0 until sounds.length()).map {
                        initPlayer(sounds.getResourceId(it, R.raw.sound_of_fox_1))
                    }
                }
                foxes.forEachIndexed { index, fox ->
                    foxPlayers[fox] = players.getOrElse(index) {
                        initPlayer(R.raw.sound_of_fox_1)
                    }
                }
            }
            viewModel.foxVolumes.observeFlow(this@GameFragment) { foxVolumes ->
                foxVolumes.forEach { (fox, volume) ->
                    foxPlayers[fox]?.setVolume(volume, volume)
                }
            }
            viewModel.frequency.observeFlow(this@GameFragment) { frequencyStep ->
                frequency.text = frequencyStep.toString()
            }
            sliderFrequency.addOnChangeListener { _, value, fromUser ->
                if (fromUser) {
                    viewModel.setFrequency(value)
                }
            }
            viewModel.timeLeft.observeFlow(this@GameFragment) { (hour, min, sec) ->
                timer.text = resources.getString(R.string.game_time_remaining, hour, min, sec)
            }
            viewModel.gameFinished.observeFlow(this@GameFragment){
                findParentFragment<BottomNavigationFragment>()
                    ?.findNavController()
                    ?.navigate(
                        BottomNavigationFragmentDirections.actionBottomNavigationFragmentToResultFragment()
                    )
            }
        }
    }

    override fun onAttach(context: Context) {
        super.onAttach(context)
        registerForActivityResult(
            ActivityResultContracts.RequestMultiplePermissions()
        ) { permissions ->
            if (permissions.getOrDefault(Manifest.permission.ACCESS_FINE_LOCATION, false)) {
                viewModel.onPermissionsGranted()
            } else {
                showAlertPermissionNeeded()
            }
        }.launch(
            arrayOf(
                Manifest.permission.ACCESS_FINE_LOCATION,
                Manifest.permission.ACCESS_COARSE_LOCATION
            )
        )
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        viewBinding.foxes.disposeComposition()
        viewBinding.foxes.setContent {
            FoxesView(
                foxesState = viewModel.isFoxFound.collectAsState(emptyMap()),
            )
        }
    }

    override fun onResume() {
        super.onResume()
        playSound()
    }

    private fun playSound(
        fox: Fox? = viewModel.foxSignalFound.value
    ) {
        foxPlayers.values.forEach(MediaPlayer::pause)
        if (fox == null) {
            noisePlayer.start()
        } else {
            noisePlayer.pause()
            foxPlayers[fox]?.start()
        }
    }

    override fun onPause() {
        super.onPause()
        noisePlayer.pause()
        foxPlayers.values.forEach(MediaPlayer::pause)
    }

    private fun showAlertPermissionNeeded() {
        AlertDialog.Builder(requireContext())
            .setMessage(getString(R.string.game_permission_needed))
            .setPositiveButton(getString(android.R.string.ok), null)
            .create()
            .show()
    }
}