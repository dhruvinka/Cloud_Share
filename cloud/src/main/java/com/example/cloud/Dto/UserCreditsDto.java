package com.example.cloud.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.aggregation.ArrayOperators;

@Data
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class UserCreditsDto {

    private Integer credits;
    private  String plan;
}
