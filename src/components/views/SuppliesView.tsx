import { useState } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { Button, Card, CardContent, Modal, Input, Select } from '../ui';
import { useSupplies } from '../../hooks/useStore';
import { SUPPLY_TYPES } from '../../types';
import type { SupplyType } from '../../types';
import { formatCurrency, formatDate, getTodayDate, parseIntegerInput } from '../../utils/format';

export function SuppliesView() {
  const { supplies, addSupply, updateSupply, deleteSupply } = useSupplies();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    type: 'bebidas' as SupplyType,
    description: '',
    amount: '',
    date: getTodayDate(),
  });

  const resetForm = () => {
    setFormData({
      type: 'bebidas',
      description: '',
      amount: '',
      date: getTodayDate(),
    });
    setEditingId(null);
  };

  const handleOpenModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = (supply: typeof supplies[0]) => {
    setFormData({
      type: supply.type,
      description: supply.description,
      amount: supply.amount.toString(),
      date: supply.date,
    });
    setEditingId(supply.id);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseIntegerInput(formData.amount);
    
    if (amount <= 0) return;

    if (editingId) {
      updateSupply(editingId, {
        type: formData.type,
        description: formData.description,
        amount,
        date: formData.date,
      });
    } else {
      addSupply({
        type: formData.type,
        description: formData.description,
        amount,
        date: formData.date,
      });
    }

    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Eliminar este insumo?')) {
      deleteSupply(id);
    }
  };

  const getTypeLabel = (type: SupplyType) => {
    return SUPPLY_TYPES.find(t => t.value === type)?.label || type;
  };

  const totalInvestment = supplies.reduce((sum, s) => sum + s.amount, 0);

  // Group by date
  const groupedByDate = supplies.reduce((acc, supply) => {
    if (!acc[supply.date]) {
      acc[supply.date] = [];
    }
    acc[supply.date].push(supply);
    return acc;
  }, {} as Record<string, typeof supplies>);

  const sortedDates = Object.keys(groupedByDate).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className="space-y-5">
      {/* Summary */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-base text-slate-400">Inversión Total</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(totalInvestment)}</p>
            </div>
            <button
              onClick={handleOpenModal}
              className="w-12 h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center transition-colors active:scale-95"
            >
              <Plus size={24} />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Supplies list */}
      {sortedDates.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <p className="text-lg">No hay insumos registrados</p>
          <p className="text-base mt-2">Toca "Agregar" para registrar una compra</p>
        </div>
      ) : (
        sortedDates.map(date => (
          <div key={date} className="space-y-3">
            <h3 className="text-base font-medium text-slate-400 px-1">
              {formatDate(date)}
            </h3>
            {groupedByDate[date].map(supply => (
              <Card key={supply.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white text-lg truncate">
                        {getTypeLabel(supply.type)}
                      </p>
                      {supply.description && (
                        <p className="text-base text-slate-400 truncate">
                          {supply.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <span className="font-semibold text-indigo-400 text-lg">
                        {formatCurrency(supply.amount)}
                      </span>
                      <button
                        onClick={() => handleEdit(supply)}
                        className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"
                      >
                        <Edit2 size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(supply.id)}
                        className="p-2.5 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ))
      )}

      {/* Fullscreen modal for add/edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Editar Insumo' : 'Agregar Insumo'}
        fullScreen
      >
        <form onSubmit={handleSubmit} className="flex flex-col min-h-full">
          {/* Form fields */}
          <div className="flex-1 px-6 py-6 space-y-6">
            <Select
              label="Tipo de insumo"
              value={formData.type}
              onChange={e => setFormData(prev => ({ ...prev, type: e.target.value as SupplyType }))}
            >
              {SUPPLY_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Select>

            <Input
              label="Descripción (opcional)"
              placeholder="Ej: 10 botellas de vodka"
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />

            <Input
              label="Monto invertido (₲)"
              type="number"
              inputMode="numeric"
              placeholder="0"
              value={formData.amount}
              onChange={e => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              required
            />

            <Input
              label="Fecha"
              type="date"
              value={formData.date}
              onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
              required
            />
          </div>

          {/* Fixed buttons at bottom */}
          <div className="sticky bottom-0 bg-slate-900 border-t border-slate-700 px-6 py-5 space-y-4">
            <Button type="submit" className="w-full justify-center text-lg py-5">
              {editingId ? 'Guardar Cambios' : 'Agregar Insumo'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="w-full justify-center text-lg py-5"
              onClick={() => setIsModalOpen(false)}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
