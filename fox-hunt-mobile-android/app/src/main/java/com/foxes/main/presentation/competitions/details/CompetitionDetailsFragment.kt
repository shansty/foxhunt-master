package com.foxes.main.presentation.competitions.details

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.appcompat.app.AlertDialog
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import androidx.navigation.fragment.navArgs
import com.foxes.R
import com.foxes.databinding.FragmentCompetitionDetailBinding
import toothpick.InjectConstructor

@InjectConstructor
class CompetitionDetailsFragment(
    private val viewBinding: FragmentCompetitionDetailBinding,
) : Fragment() {

    private val navArgs: CompetitionDetailsFragmentArgs by navArgs()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val competition = navArgs.data
        viewBinding.run {
            name.text = competition.name
            location.text = competition.location
            coach.text = competition.coach
            silencePeriod.text = competition.hasSilenceInterval.toString()
            foxes.text = competition.foxAmount
            duration.text =
                getString(R.string.competition_detail_duration_min, competition.duration)
            participants.text = competition.participants
            date.text = competition.date
            time.text = competition.time

            join.setOnClickListener {
                showAlert()
            }
        }
    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        return viewBinding.root
    }

    private fun showAlert() {
        AlertDialog.Builder(requireContext())
            .setMessage(getString(R.string.competition_detail_alert_success))
            .setPositiveButton(getString(android.R.string.ok)) { _, _ ->
                findNavController().navigateUp()
            }
            .create()
            .show()
    }
}