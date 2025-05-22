package com.foxes.main.presentation.login

import android.os.Bundle
import android.widget.Toast
import androidx.navigation.fragment.findNavController
import com.foxes.databinding.FragmentLoginBinding
import com.foxes.main.presentation.base.BaseFragment
import com.foxes.main.presentation.base.utils.observeFlow
import toothpick.InjectConstructor

@InjectConstructor
class LoginFragment(
    override val viewModel: LoginViewModel,
    override val viewBinding: FragmentLoginBinding,
) : BaseFragment() {

    init {
        with(viewBinding) {
            buttonLoginSignIn.setOnClickListener {
                viewModel.onSingInClicked(
                    edittextLoginEmail.text.toString(),
                    edittextLoginPassword.text.toString(),
                    edittextLoginDomain.text.toString()
                )
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        viewModel.onAuthorized.observeFlow(this) {
            findNavController().navigate(
                LoginFragmentDirections.actionLoginFragmentToOnboardingFragment()
            )
        }
        viewModel.onError.observeFlow(this) {
            handleError(it.javaClass.name.toString())
        }
    }

    private fun handleError(errorMessage: String) {
        Toast.makeText(requireContext(), errorMessage, Toast.LENGTH_SHORT).show()
    }
}