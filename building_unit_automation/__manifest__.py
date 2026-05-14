{
    'name': 'Building Unit Automation',
    'version': '17.0.1.0',
    'category': 'Real Estate',
    'summary': 'Automate building unit status changes and filters',
    'description': 'Add cron for setting units to free, filters for invoiced units, and bulk status change from invoices.',
    'author': 'Your Name',
    'depends': ['itsys_real_estate', 'account'],
    'data': [
        'security/ir.model.access.csv',
        'views/building_unit_views.xml',
    ],
    'installable': True,
    'auto_install': False,
    'application': False,
}