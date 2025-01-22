const ToastMessage = ({ message, type }) => {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '50px',
        right: '20px',
        background: type === 'success' ? '#21ba45' : '#db2828',
        color: 'white',
        padding: '20px 30px',
        borderRadius: '5px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        zIndex: 1000,
      }}
    >
      {message}
    </div>
  );
};

export default ToastMessage;
