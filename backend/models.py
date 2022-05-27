"""SQLAlchemy database models"""
from sqlalchemy import DATE, Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.sql.expression import text

from .database import Base


class Region(Base):
    __tablename__ = "regions"
    name = Column(String, primary_key=True, nullable=False, unique=True)


class Employee(Base):
    __tablename__ = "employees"
    employee_id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String, nullable=False)
    position = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    date_created = Column(DATE(), nullable=False, server_default=func.now())
    region_name = Column(
        String, ForeignKey("regions.name", ondelete="NO ACTION"), nullable=False
    )
    is_active = Column(Boolean, nullable=False)
    inspections = relationship("Inspection", uselist=True, back_populates="employee")
    assignments = relationship("Assignment", uselist=True, back_populates="employee")
    comments = relationship(
        "Comment",
        back_populates="employee",
        uselist=True,
        cascade="all,delete-orphan",
        order_by="Comment.comment_id",
    )


class User(Base):
    __tablename__ = "users"
    user_id = Column(Integer, primary_key=True, nullable=False)
    email = Column(
        String,
        ForeignKey("employees.email", ondelete="CASCADE"),
        unique=True,
        nullable=False,
    )
    password = Column(String, nullable=False)
    is_active = Column(Boolean, nullable=False)


class Customer(Base):
    __tablename__ = "customers"
    customer_id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String, unique=True, nullable=False)
    street = Column(String, nullable=False)
    postal_code = Column(Integer, nullable=False)
    postal_name = Column(String, nullable=False)
    municipality = Column(String, nullable=False)
    region_name = Column(
        String, ForeignKey("regions.name", ondelete="NO ACTION"), nullable=False
    )
    date_created = Column(DATE(), nullable=False, server_default=func.now())
    created_by_employee_id = Column(
        Integer,
        ForeignKey("employees.employee_id", ondelete="NO ACTION"),
        nullable=False,
    )
    date_updated = Column(DATE(), nullable=True, onupdate=func.now())
    updated_by_employee_id = Column(
        Integer,
        ForeignKey("employees.employee_id", ondelete="NO ACTION"),
        nullable=True,
    )
    is_active = Column(Boolean, nullable=False)
    created_by_employee = relationship(
        "Employee",
        foreign_keys=created_by_employee_id,
    )
    updated_by_employee = relationship(
        "Employee",
        foreign_keys=updated_by_employee_id,
    )
    inspections = relationship(
        "Inspection",
        back_populates="customer",
        uselist=True,
        cascade="all,delete-orphan",
    )


class Inspection(Base):
    __tablename__ = "inspections"
    inspection_id = Column(Integer, primary_key=True, nullable=False)
    customer_id = Column(
        Integer,
        ForeignKey("customers.customer_id", ondelete="NO ACTION"),
        nullable=False,
    )
    description = Column(String, nullable=False)
    status = Column(String, nullable=False)
    inspection_year = Column(Integer, nullable=False)
    inspection_month = Column(String, nullable=False)
    date_created = Column(DATE(), nullable=False, server_default=func.now())
    created_by_employee_id = Column(
        Integer,
        ForeignKey("employees.employee_id", ondelete="NO ACTION"),
        nullable=False,
    )
    customer = relationship("Customer", back_populates="inspections")
    employee = relationship("Employee", back_populates="inspections")
    assigned_employees = relationship(
        "Assignment",
        back_populates="inspection",
        uselist=True,
        cascade="all,delete-orphan",
    )
    comments = relationship(
        "Comment",
        back_populates="inspection",
        uselist=True,
        cascade="all,delete-orphan",
        order_by="Comment.comment_id",
    )


class Comment(Base):
    __tablename__ = "comments"
    comment_id = Column(Integer, primary_key=True, nullable=False)
    comment_text = Column(String, nullable=False)
    employee_id = Column(
        Integer,
        ForeignKey("employees.employee_id", ondelete="NO ACTION"),
        nullable=False,
    )
    inspection_id = Column(
        Integer,
        ForeignKey("inspections.inspection_id", ondelete="NO ACTION"),
        nullable=False,
    )
    date_created = Column(DATE(), nullable=False, server_default=func.now())
    inspection = relationship("Inspection", back_populates="comments")
    employee = relationship("Employee", back_populates="comments")


class Assignment(Base):
    __tablename__ = "assignments"
    assignment_id = Column(Integer, primary_key=True, nullable=False)
    employee_id = Column(
        Integer,
        ForeignKey("employees.employee_id", ondelete="NO ACTION"),
        nullable=False,
    )
    inspection_id = Column(
        Integer,
        ForeignKey("inspections.inspection_id", ondelete="NO ACTION"),
        nullable=False,
    )
    date_created = Column(DATE(), nullable=False, server_default=text("now()"))
    inspection = relationship("Inspection", back_populates="assigned_employees")
    employee = relationship("Employee", back_populates="assignments")
