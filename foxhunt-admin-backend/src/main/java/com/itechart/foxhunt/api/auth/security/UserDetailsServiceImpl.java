package com.itechart.foxhunt.api.auth.security;

import com.itechart.foxhunt.api.exception.UserNotFoundException;
import com.itechart.foxhunt.api.user.dao.UserRepository;
import com.itechart.foxhunt.domain.entity.RoleEntity;
import com.itechart.foxhunt.domain.entity.UserEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserEntity userEntity = userRepository.findByEmail(email)
            .orElseThrow(() -> {
                throw new UsernameNotFoundException(
                    String.format("Authentication error. User with email %s does not exist.", email));
            });

        if (userEntity.isBanned()) {
            throw new AccessDeniedException(String.format("User with email %s is banned.", email));
        }

        if (!userEntity.isActivated()) {
            throw new UserNotFoundException(
                String.format("Authentication error. User with email %s is not activated.", email));
        }

        return new AppUserPrincipal(userEntity, getUserAuthorities(userEntity.getRoles()));
    }

    private Set<SimpleGrantedAuthority> getUserAuthorities(Set<RoleEntity> roles) {
        return roles
            .stream()
            .map(role -> new SimpleGrantedAuthority("ROLE_" + role.getRole()))
            .collect(Collectors.toSet());
    }
}
