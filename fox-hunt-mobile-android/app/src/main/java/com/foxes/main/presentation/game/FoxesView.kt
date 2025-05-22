package com.foxes.main.presentation.game

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.material.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.State
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import com.foxes.R
import com.foxes.main.domain.Fox

@Composable
fun FoxesView(
    foxesState: State<Map<Fox, Boolean>>,
) {
    Row {
        foxesState.value.forEach { (fox, isFound) ->
            ItemFox(
                text = fox.label,
                isFound = isFound,
            )
        }
    }
}

@Composable
fun ItemFox(
    modifier: Modifier = Modifier,
    text: String,
    isFound: Boolean,
) {
    Column(
        modifier = modifier,
    ) {
        val imageRes = if (isFound) {
            R.drawable.ic_launcher_foreground
        } else {
            R.drawable.ic_launcher_background
        }
        Image(
            painter = painterResource(imageRes),
            contentDescription = "",
            modifier = Modifier.width(60.dp).padding(4.dp)
        )
        Text(
            text = text,
            modifier = Modifier.align(Alignment.CenterHorizontally),
        )
    }
}