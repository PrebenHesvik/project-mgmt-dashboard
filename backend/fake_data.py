import itertools
from faker import Faker
from random import choice, choices, random
from .database import SessionLocal
from .models import Employee, Customer, Inspection, User, Assignment
from .database_strategies import CommitData
from .utils import hash_password
from .schemas.employees import EmployeeCreate
from .schemas.validators import REGIONS
from sqlalchemy import and_


fake = Faker()

# class Database:
#     def __enter__(self):


SERVICE_ENGINEERS_PER_DEPARTMENT = 10

YEARS = [2018, 2019, 2020, 2021]

MONTHS = [
    "Januar",
    "Februar",
    "Mars",
    "April",
    "May",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Desember",
]


def create_fake_employees():
    db = SessionLocal()
    if db.query(Employee).first():
        return
    employee_list = []
    for _ in range(30):
        name = " ".join([fake.first_name(), fake.last_name()])
        employee = {
            "name": name,
            "position": "Servicemontør",
            "email": ".".join(name.lower().split(" ")) + "@company.no",
            "region_name": choice(REGIONS),
            "is_active": True,
        }
        employee_list.append(employee)

    for region in REGIONS:
        name = " ".join([fake.first_name(), fake.last_name()])
        employee = {
            "name": name,
            "position": "Serviceleder",
            "email": ".".join(name.lower().split(" ")) + "@company.no",
            "region_name": region,
            "is_active": True,
        }
        employee_list.append(employee)

    ceo = {
        "name": "Henry Hazlitt",
        "position": "Leder",
        "email": "henry.hazlitt@company.com",
        "region_name": "Vest",
        "is_active": True,
    }
    employee_list.append(ceo)

    admin = {
        "name": "Preben Hesvik",
        "position": "Admin",
        "email": "preben.hesvik@company.com",
        "region_name": "Vest",
        "is_active": True,
    }
    employee_list.append(admin)

    for employee in employee_list:
        with CommitData(db, Employee(**employee)):
            pass
    db.close()


def create_fake_users():
    db = SessionLocal()
    if not db.query(User).first():
        employee_emails = db.query(Employee.email).all()
        email_list = [emp[0] for emp in employee_emails]
        for email in email_list:
            user = {
                "email": email,
                "password": hash_password("password"),
                "is_active": True,
            }
            with CommitData(db, User(**user)):
                pass
    db.close()


def create_fake_customers():
    db = SessionLocal()
    if db.query(Customer).first():
        return
    for region, employee_id in zip(REGIONS, [31, 32, 33, 34]):
        postal_names = [fake.city() for _ in range(150)]
        municipalities = [fake.city() for _ in range(40)]
        company_names = {fake.company() for _ in range(150)}

        for company in company_names:

            customer = {
                "name": company,
                "street": fake.street_address(),
                "postal_code": 4524,
                "postal_name": choice(postal_names),
                "municipality": choice(municipalities),
                "region_name": region,
                "created_by_employee_id": employee_id,
                "is_active": True,
            }

            if not (
                db.query(Customer).filter(Customer.name == customer["name"]).first()
            ):
                with CommitData(db, Customer(**customer)):
                    pass
    db.close()


def create_fake_inspections():
    db = SessionLocal()
    if db.query(Inspection).first():
        return

    manager_query = db.query(Employee).filter(Employee.position == "Serviceleder")
    managers = {m.region_name: m.employee_id for m in manager_query}

    customers = {"Vest": [], "Øst": [], "Nord": [], "Sør": []}
    for region, customer_list in customers.items():
        customer_query = db.query(Customer).filter(Customer.region_name == region).all()
        for customer in customer_query:
            customer_list.append(customer.customer_id)

    for year in YEARS:
        for region, customer_list in customers.items():
            for customer_id in customer_list:
                inspection(
                    customer_id, year, region, managers, f"Årlig kontroll {year}"
                )
                if customer_id % 3 == 0:
                    inspection(
                        customer_id,
                        year,
                        region,
                        managers,
                        f"Halvårlig kontroll {year}",
                    )
    db.close()


def inspection(customer_id, year, region, managers, description):
    db = SessionLocal()
    inspect = {
        "customer_id": customer_id,
        "description": description,
        "status": "Fullført",
        "inspection_year": year,
        "inspection_month": choice(MONTHS),
        "created_by_employee_id": managers.get(region),
    }

    if random() < 0.9:
        with CommitData(db, Inspection(**inspect)):
            pass
    db.close()


def create_fake_assignments():
    db = SessionLocal()
    if db.query(Assignment).first():
        return
    service_engineers = {"Vest": [], "Øst": [], "Nord": [], "Sør": []}
    for region, engineer_list in service_engineers.items():
        engineer_query = (
            db.query(Employee)
            .filter(
                and_(
                    Employee.region_name == region, Employee.position == "Servicemontør"
                )
            )
            .all()
        )
        for employee in engineer_query:
            engineer_list.append(employee.employee_id)

    inspection_query = db.query(Inspection).all()
    for inspection in inspection_query:
        assigned_engineers = choices(
            service_engineers[inspection.customer.region_name], k=choice([1, 2])
        )
        for engineer in assigned_engineers:
            assignment = {
                "employee_id": engineer,
                "inspection_id": inspection.inspection_id,
            }
            with CommitData(db, Assignment(**assignment)):
                pass
    db.close()


def create_fake_data():
    create_fake_employees()
    create_fake_users()
    create_fake_customers()
    create_fake_inspections()
    create_fake_assignments()
