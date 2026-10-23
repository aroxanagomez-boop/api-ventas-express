-- Procedimientos almacenados requeridos por /api/v1/productos.
-- Asume que la tabla productos tiene id_producto, nombre_producto y precio_unitario.

DELIMITER //

DROP PROCEDURE IF EXISTS sp_listar_productos//
CREATE PROCEDURE sp_listar_productos()
BEGIN
    SELECT id_producto, nombre_producto, precio_unitario
    FROM productos
    ORDER BY id_producto;
END//

DROP PROCEDURE IF EXISTS sp_crear_producto//
CREATE PROCEDURE sp_crear_producto(
    IN p_nombre_producto VARCHAR(255),
    IN p_precio_unitario DECIMAL(10, 2)
)
BEGIN
    INSERT INTO productos (nombre_producto, precio_unitario)
    VALUES (p_nombre_producto, p_precio_unitario);

    SELECT id_producto, nombre_producto, precio_unitario
    FROM productos
    WHERE id_producto = LAST_INSERT_ID();
END//

DELIMITER ;
