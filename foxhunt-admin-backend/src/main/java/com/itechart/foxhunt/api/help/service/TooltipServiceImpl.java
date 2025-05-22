package com.itechart.foxhunt.api.help.service;

import com.itechart.foxhunt.api.help.mapper.TooltipMapper;
import com.itechart.foxhunt.api.help.repository.TooltipRepository;
import com.itechart.foxhunt.api.help.dto.Tooltip;
import com.itechart.foxhunt.domain.entity.TooltipEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TooltipServiceImpl implements TooltipService {

    private final TooltipRepository tooltipRepository;

    private final TooltipMapper tooltipMapper;

    @Override
    public List<Tooltip> getAll() {
        return tooltipRepository
            .findAll()
            .stream()
            .map(tooltipMapper::entityToDomain)
            .collect(Collectors.toList());
    }

    @Override
    public Tooltip create(Tooltip tooltip) {
        return saveTooltipInDb(tooltipMapper.domainToEntity(tooltip));
    }

    @Override
    public Tooltip updateOne(Tooltip tooltip, Long tooltipId) {
        TooltipEntity currentTooltip = getTooltipById(tooltipId);
        currentTooltip.setCode(tooltip.getCode());
        currentTooltip.setMessage(tooltip.getMessage());
        return saveTooltipInDb(currentTooltip);
    }

    @Override
    public void deleteById(Long tooltipId) {
        tooltipRepository.deleteById(tooltipId);
    }

    private TooltipEntity getTooltipById(Long tooltipId) {
        return tooltipRepository
            .findById(tooltipId)
            .orElseThrow(() -> {
                final String msg = String.format("Invalid #: %s", tooltipId.toString());
                throw new EntityNotFoundException(msg);
            });
    }

    private Tooltip saveTooltipInDb(TooltipEntity tooltipEntity) {
        return tooltipMapper
            .entityToDomain(tooltipRepository
                .save(tooltipEntity));
    }
}
