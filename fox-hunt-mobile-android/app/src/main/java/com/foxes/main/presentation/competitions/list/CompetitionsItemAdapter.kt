package com.foxes.main.presentation.competitions.list

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.foxes.databinding.ItemCompetitionBinding
import com.foxes.main.presentation.competitions.Competition

class CompetitionsItemAdapter(private val listener: (Competition) -> Unit) :
    RecyclerView.Adapter<CompetitionsItemAdapter.ViewHolder>() {

    var dataSet = emptyList<Competition>()

    override fun onCreateViewHolder(viewGroup: ViewGroup, viewType: Int): ViewHolder {
        return ViewHolder(viewGroup, listener)
    }

    override fun onBindViewHolder(viewHolder: ViewHolder, position: Int) {
        viewHolder.bind(dataSet[position])
    }

    override fun getItemCount() = dataSet.size


    inner class ViewHolder(
        viewGroup: ViewGroup,
        listener: (Competition) -> Unit
    ) : RecyclerView.ViewHolder(
        ItemCompetitionBinding.inflate(
            LayoutInflater.from(viewGroup.context),
            viewGroup,
            false
        ).root
    ) {
        private val binding = ItemCompetitionBinding.bind(itemView)

        init {
            itemView.setOnClickListener { listener.invoke(dataSet[adapterPosition]) }
        }

        fun bind(competition: Competition) = binding.run {
            name.text = competition.name
            status.text = competition.status.title
            location.text = competition.location
            date.text = competition.date
            coach.text = competition.coach
        }
    }
}
