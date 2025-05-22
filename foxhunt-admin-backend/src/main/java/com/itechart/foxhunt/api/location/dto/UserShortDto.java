package com.itechart.foxhunt.api.location.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserShortDto {
    private Long userId;
    private String email;
    private String firstName;
    private String lastName;
}
