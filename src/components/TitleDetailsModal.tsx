import React from 'react';
import { Modal } from 'antd';
import { Title } from '../services/api';
import TitleDetails from './TitleDetails';

interface TitleDetailsModalProps {
  title: Title | null;
  visible: boolean;
  onClose: () => void;
}

const TitleDetailsModal: React.FC<TitleDetailsModalProps> = ({
  title,
  visible,
  onClose,
}) => {
  if (!title) return null;

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={1000}
      style={{ top: 20 }}
      bodyStyle={{ maxHeight: 'calc(100vh - 100px)', overflow: 'auto' }}
    >
      <TitleDetails title={title} />
    </Modal>
  );
};

export default TitleDetailsModal; 