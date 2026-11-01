function Header({cantidadCarrito}){
    return(
        <header className="encabezado">
            <div>
                <h1>TechStore</h1>
                <p>Tecnología para estudiambres</p>
            </div>

            <nav className="navegacion">
                <a href="#inicio">Inicio</a>
                <a href="#productos">Productos</a>
                <a href="#pokemons">Pokemons</a>
                <a href="#contacto">Contacto</a>
            </nav>

            <div className="carrito-resumen">
                🛒 {cantidadCarrito}
            </div>

        </header>
    )
}

export default Header