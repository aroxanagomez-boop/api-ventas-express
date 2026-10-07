CREATE PROCEDURE sp_venta_id(IN id_venta INT)
BEGIN
    SELECT
        v.fecha_venta,
        c.nombre_completo AS cliente,
        c.direccion_despacho AS direccion,
        p.nombre_producto AS producto,
        v.cantidad,
        (v.cantidad * p.precio_unitario) AS monto_venta
    FROM ventas AS v
    INNER JOIN clientes AS c ON c.id_cliente = v.id_cliente
    INNER JOIN productos AS p ON p.id_producto = v.id_producto
    WHERE v.id_venta = id_venta;
END //

call sp_venta_id(1);