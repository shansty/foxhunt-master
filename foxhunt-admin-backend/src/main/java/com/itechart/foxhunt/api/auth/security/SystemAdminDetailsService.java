package com.itechart.foxhunt.api.auth.security;

import com.itechart.foxhunt.api.auth.security.SystemAdminPrincipal;
import com.itechart.foxhunt.api.core.ApiConstants;
import com.itechart.foxhunt.api.user.dao.SystemAdminRepository;
import com.itechart.foxhunt.api.user.dto.SystemAdmin;
import com.itechart.foxhunt.api.user.entity.SystemAdminEntity;
import com.itechart.foxhunt.api.user.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class SystemAdminDetailsService implements UserDetailsService {

    private final SystemAdminRepository systemAdminRepository;
    private final UserMapper userMapper;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        SystemAdminEntity systemAdminEntity = systemAdminRepository.findByEmail(email)
            .orElseThrow(() -> {
                throw new UsernameNotFoundException(
                    String.format("Authentication error. System admin with email %s does not exist.", email));
            });
        SystemAdmin systemAdmin = userMapper.entityToDomain(systemAdminEntity);
        Set<SimpleGrantedAuthority> systemAdminAuthorities =
            Set.of(new SimpleGrantedAuthority(ApiConstants.ROLE_SYSTEM_ADMIN));
        return new SystemAdminPrincipal(systemAdmin, systemAdminAuthorities);
    }

}
