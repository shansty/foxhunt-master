package com.foxes.main.presentation.game.difficulty

import android.Manifest
import android.content.Context
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AlertDialog
import androidx.navigation.fragment.findNavController
import com.foxes.R
import com.foxes.databinding.FragmentGameDifficultyBinding
import com.foxes.main.presentation.base.BaseFragment
import com.foxes.main.presentation.base.utils.observeFlow
import toothpick.InjectConstructor

@InjectConstructor
class GameDifficultyFragment(
    override val viewBinding: FragmentGameDifficultyBinding,
    override val viewModel: GameDifficultyViewModel,
) : BaseFragment() {

    private var selectedDifficulty: GameDifficultyMode? = null

    private val activityResultLauncher = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { permissions ->
        if (permissions.getOrDefault(Manifest.permission.ACCESS_COARSE_LOCATION, false)) {
            viewModel.startGame(selectedDifficulty!!)
        } else {
            showAlertPermissionNeeded()
        }
    }

    init {
        viewBinding.run {
            mapOf(
                easy to GameDifficultyMode.EASY,
                normal to GameDifficultyMode.NORMAL,
                hard to GameDifficultyMode.HARD,
                advanced to GameDifficultyMode.ADVANCED
            ).forEach { (view, difficulty) ->
                view.setOnClickListener {
                    selectedDifficulty = difficulty
                    activityResultLauncher.launch(
                        arrayOf(
                            Manifest.permission.ACCESS_FINE_LOCATION,
                            Manifest.permission.ACCESS_COARSE_LOCATION
                        )
                    )
                }
            }
            custom.setOnClickListener {
                findNavController().navigate(
                    GameDifficultyFragmentDirections.actionGameDifficultyFragmentToGameSettingsFragment()
                )
            }
        }
    }

    private fun showAlertPermissionNeeded() {
        AlertDialog.Builder(requireContext())
            .setMessage(getString(R.string.game_permission_needed))
            .setPositiveButton(getString(android.R.string.ok), null)
            .create()
            .show()
    }

    override fun onAttach(context: Context) {
        super.onAttach(context)
        viewModel.onPopUpToBottomNavScreen.observeFlow(this) {
            findNavController().navigate(
                GameDifficultyFragmentDirections.actionPopUpGameDifficultyToBottomNavFragment()
            )
        }
        viewModel.onOpenBottomNavScreen.observeFlow(this) {
            findNavController().navigate(
                GameDifficultyFragmentDirections.actionGameDifficultyToBottomNavFragment()
            )
        }
    }
}