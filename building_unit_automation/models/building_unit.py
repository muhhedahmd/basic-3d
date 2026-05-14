# -*- coding: utf-8 -*-
from odoo import api, fields, models, _


class BuildingUnit(models.Model):
    _inherit = 'product.template'

    # Add a computed field for units in invoices
    in_invoice = fields.Boolean(compute='_compute_in_invoice', search='_search_in_invoice', string='In Invoice')

    def _search_in_invoice(self, operator, value):
        if operator not in ['=', '!='] or value not in [True, False]:
            raise NotImplementedError
        move_lines = self.env['account.move.line'].search([('product_id', '!=', False)])
        product_ids = move_lines.mapped('product_id').ids
        if operator == '=':
            if value:
                return [('product_variant_id', 'in', product_ids)]
            else:
                return [('product_variant_id', 'not in', product_ids)]
        elif operator == '!=':
            if value:
                return [('product_variant_id', 'not in', product_ids)]
            else:
                return [('product_variant_id', 'in', product_ids)]

    @api.depends()
    def _compute_in_invoice(self):
        for unit in self:
            invoice_lines = self.env['account.move.line'].search([('product_id', '=', unit.product_variant_id.id)])
            unit.in_invoice = bool(invoice_lines)

    def action_set_selected_units_sold(self):
        """
        Action to set selected building units to 'sold' state.
        """
        if self:
            self.write({'state': 'sold'})
        return {'type': 'ir.actions.act_window_close'}

