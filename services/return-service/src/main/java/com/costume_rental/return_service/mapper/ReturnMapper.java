package com.costume_rental.return_service.mapper;

import org.mapstruct.Mapper;

import com.costume_rental.return_service.dto.response.ReturnDetailResponse;
import com.costume_rental.return_service.dto.response.ReturnErrorDetailResponse;
import com.costume_rental.return_service.dto.response.ReturnResponse;
import com.costume_rental.return_service.entity.ChiTietLoi;
import com.costume_rental.return_service.entity.ChiTietTra;
import com.costume_rental.return_service.entity.PhieuTra;

@Mapper(
        componentModel = "spring",
        uses = {LoiMapper.class},
        unmappedTargetPolicy = org.mapstruct.ReportingPolicy.IGNORE)
public interface ReturnMapper {
    ReturnResponse toReturnResponse(PhieuTra phieuTra);

    ReturnDetailResponse toReturnDetailResponse(ChiTietTra chiTietTra);

    ReturnErrorDetailResponse toReturnErrorDetailResponse(ChiTietLoi chiTietLoi);
}
