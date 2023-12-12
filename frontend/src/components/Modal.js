function Modal({ show, children }) {
    if (!show) {
      return null;
    }
    
    return (
      <div style={{ position: 'fixed', top: 0, bottom: 0, left: 0, right: 0, paddingBottom: 100,  backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="total2" style={{ backgroundColor: 'white', padding: '1em', width: '60%', height: '100%' }}>
          {children}
        </div>
      </div>
    );
  }
  export default Modal;