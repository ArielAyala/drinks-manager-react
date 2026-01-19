import { useState } from 'react';
import { Plus, Trash2, Edit2, Wine } from 'lucide-react';
import { Button, Card, CardContent, Modal, Input } from '../ui';
import { useDrinks } from '../../hooks/useStore';
import { formatCurrency, parseIntegerInput } from '../../utils/format';

export function DrinksView() {
  const { drinks, addDrink, updateDrink, deleteDrink } = useDrinks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '15000',
    active: true,
  });

  const resetForm = () => {
    setFormData({
      name: '',
      price: '15000',
      active: true,
    });
    setEditingId(null);
  };

  const handleOpenModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = (drink: typeof drinks[0]) => {
    setFormData({
      name: drink.name,
      price: drink.price.toString(),
      active: drink.active,
    });
    setEditingId(drink.id);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseIntegerInput(formData.price);
    
    if (!formData.name.trim() || price <= 0) return;

    if (editingId) {
      updateDrink(editingId, {
        name: formData.name.trim(),
        price,
        active: formData.active,
      });
    } else {
      addDrink({
        name: formData.name.trim(),
        price,
        active: formData.active,
      });
    }

    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Eliminar este trago?')) {
      deleteDrink(id);
    }
  };

  const handleToggleActive = (drink: typeof drinks[0]) => {
    updateDrink(drink.id, { active: !drink.active });
  };

  const activeDrinks = drinks.filter(d => d.active);
  const inactiveDrinks = drinks.filter(d => !d.active);

  return (
    <div className="space-y-5">
      {/* Resumen */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-base text-slate-400">Tragos Activos</p>
              <p className="text-2xl font-bold text-white">{activeDrinks.length}</p>
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

      {/* Lista de tragos activos */}
      <div className="space-y-3">
        <h3 className="text-base font-medium text-slate-400 px-1">Tragos disponibles</h3>
        {activeDrinks.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <p className="text-lg">No hay tragos activos</p>
          </div>
        ) : (
          activeDrinks.map(drink => (
            <Card key={drink.id}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-600/20 rounded-full flex items-center justify-center">
                      <Wine size={24} className="text-indigo-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white text-lg">{drink.name}</p>
                      <p className="text-base text-indigo-400 font-semibold">
                        {formatCurrency(drink.price)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleActive(drink)}
                      className="px-3 py-2 text-green-400 hover:bg-slate-700 rounded-lg text-sm font-medium"
                      title="Desactivar"
                    >
                      Activo
                    </button>
                    <button
                      onClick={() => handleEdit(drink)}
                      className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"
                    >
                      <Edit2 size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(drink.id)}
                      className="p-2.5 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Lista de tragos inactivos */}
      {inactiveDrinks.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-base font-medium text-slate-400 px-1">Tragos inactivos</h3>
          {inactiveDrinks.map(drink => (
            <Card key={drink.id} className="opacity-60">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center">
                      <Wine size={24} className="text-slate-500" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-400 text-lg">{drink.name}</p>
                      <p className="text-base text-slate-500">
                        {formatCurrency(drink.price)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleActive(drink)}
                      className="px-3 py-2 text-slate-500 hover:text-green-400 hover:bg-slate-700 rounded-lg text-sm font-medium"
                      title="Activar"
                    >
                      Inactivo
                    </button>
                    <button
                      onClick={() => handleEdit(drink)}
                      className="p-2.5 text-slate-500 hover:text-white hover:bg-slate-700 rounded-lg"
                    >
                      <Edit2 size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(drink.id)}
                      className="p-2.5 text-slate-500 hover:text-red-400 hover:bg-slate-700 rounded-lg"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de agregar/editar */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Editar Trago' : 'Nuevo Trago'}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Nombre del trago"
            placeholder="Ej: Mojito especial"
            value={formData.name}
            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />

          <Input
            label="Precio (₲)"
            type="number"
            inputMode="numeric"
            placeholder="15000"
            value={formData.price}
            onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))}
            required
          />

          <label className="flex items-center gap-4 cursor-pointer py-2">
            <input
              type="checkbox"
              checked={formData.active}
              onChange={e => setFormData(prev => ({ ...prev, active: e.target.checked }))}
              className="w-6 h-6 rounded bg-slate-700 border-slate-600 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-base text-slate-300">Trago activo (disponible para venta)</span>
          </label>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() => setIsModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              {editingId ? 'Guardar' : 'Agregar'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
