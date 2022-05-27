from fastapi import HTTPException, status

REGIONS = ("Vest", "Øst", "Nord", "Sør")

POSITIONS = ("Montør", "Serviceleder", "Leder", "Admin")

INSPECTION_STATUS = (
    "Planlagt",
    "Pågår",
    "Fullført",
    "Avlyst",
)


def validate_region(cls, value: dict) -> dict:
    region = value.get("region_name")
    if region not in REGIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"{region} is not a valid region.",
        )
    return value


def validate_inspection_status(cls, value: dict) -> dict:
    inspection_status = value.get("status")
    if inspection_status not in INSPECTION_STATUS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"{inspection_status} is not a valid work order status.",
        )
    return value
