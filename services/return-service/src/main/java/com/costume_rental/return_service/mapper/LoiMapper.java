package com.costume_rental.return_service.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import com.costume_rental.return_service.dto.request.LoiRequest;
import com.costume_rental.return_service.dto.response.LoiResponse;
import com.costume_rental.return_service.entity.Loi;

@Mapper(componentModel = "spring", unmappedTargetPolicy = org.mapstruct.ReportingPolicy.IGNORE)
public interface LoiMapper {
    Loi toLoi(LoiRequest request);

    LoiResponse toLoiResponse(Loi loi);

    void updateLoi(@MappingTarget Loi loi, LoiRequest request);
}
