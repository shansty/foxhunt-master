package com.itechart.foxhunt.api.user.email;

import com.itechart.foxhunt.domain.entity.EmailTemplateEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmailTemplateRepository extends JpaRepository<EmailTemplateEntity, Long> {

    EmailTemplateEntity findByName(String name);

}
