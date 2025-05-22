package com.itechart.foxhunt.api.help.service;

import com.itechart.foxhunt.api.help.dto.Tooltip;

import java.util.List;

public interface TooltipService {

    List<Tooltip> getAll();

    Tooltip create(Tooltip tooltip);

    Tooltip updateOne(Tooltip tooltip, Long tooltipId);

    void deleteById(Long tooltipId);
}
