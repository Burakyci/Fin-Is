from pydantic import BaseModel

class CreditApplication(BaseModel):
    loan_amount: float       
    loan_term_months: int    

   
    monthly_income: float    
    additional_income: float = 0.0 
    expenses: float = 0.0    
    rent_payment: float = 0.0
    existing_loans: float = 0.0      
    credit_card_limit: float = 0.0   
    credit_card_debt: float = 0.0    
    bank_balance: float = 0.0        
    investments: float = 0.0         
    real_estate_value: float = 0.0   

   
    kkb_score: int = 600             
    payment_delays: int = 0          
    defaulted_loans: bool = False    

   
    age: int
    employment_type: str            
    work_experience: int = 0        
    job_stability: str = "stable"   
    home_ownership: str = "owner"   
    residence_duration: int = 0     
    legal_issues: bool = False      
    has_insurance: bool = True      
    customer_segment: str = "mass"  
    existing_relationship: int = 0  
    total_banking_products: int = 0 
