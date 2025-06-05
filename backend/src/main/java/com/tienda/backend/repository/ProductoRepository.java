package com.tienda.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tienda.backend.model.Producto;

public interface ProductoRepository extends JpaRepository<Producto, Long> {

}
