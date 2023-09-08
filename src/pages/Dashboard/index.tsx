import React, { useState, useEffect } from "react"

import Header from "../../components/Header"
import api from "../../services/api"
import Food from "../../components/Food"
import ModalAddFood from "../../components/ModalAddFood"
import ModalEditFood from "../../components/ModalEditFood"
import { FoodsContainer } from "./styles"

interface FoodData {
  id: number
  name: string
  description: string
  price: number
  available: boolean
  image: string
}

const Dashboard: React.FC = () => {
  const [foods, setFoods] = useState<FoodData[]>([])
  const [editingFood, setEditingFood] = useState<FoodData | {}>({})
  const [modalOpen, setModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)

  const fetchFoods = async () => {
    const response = await api.get<FoodData[]>("/foods")
    setFoods(response.data)
  }

  useEffect(() => {
    fetchFoods()
  }, [])

  const handleAddFood = async (food: FoodData) => {
    try {
      const response = await api.post<FoodData>("/foods", {
        ...food,
        available: true,
      })
      setFoods([...foods, response.data])
    } catch (err) {
      console.log(err)
    }
  }

  const handleUpdateFood = async (food: FoodData) => {
    try {
      const foodUpdated = await api.put<FoodData>(
        `/foods/${(editingFood as FoodData).id}`,
        { ...(editingFood as FoodData), ...food }
      )

      const foodsUpdated = foods.map((f) =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data
      )

      setFoods(foodsUpdated)
    } catch (err) {
      console.log(err)
    }
  }

  const handleDeleteFood = async (id: number) => {
    try {
      await api.delete(`/foods/${id}`)
      const foodsFiltered = foods.filter((food) => food.id !== id)
      setFoods(foodsFiltered)
    } catch (err) {
      console.log(err)
    }
  }

  const toggleModal = () => {
    setModalOpen(!modalOpen)
  }

  const toggleEditModal = () => {
    setEditModalOpen(!editModalOpen)
  }

  const handleEditFood = (food: FoodData) => {
    setEditingFood(food)
    setEditModalOpen(true)
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood as FoodData}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map((food) => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  )
}

export default Dashboard
