import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Button from "./Button";
import Typo from "./Typo";
import { colors } from "../constants/theme";

type Props = {
  visible: boolean;
  title?: string;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
};

const CustomAlert: React.FC<Props> = ({
  visible,
  title = "Alert",
  message,
  onClose,
  onConfirm,
  confirmText = "OK",
  cancelText = "Cancel",
}) => {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
    >
      <View style={styles.backdrop}>
        <View style={styles.container}>
          {title && <Text style={styles.title}>{title}</Text>}
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttons}>
            {onConfirm ? (
              <>
                <TouchableOpacity
                  style={[styles.button, styles.cancel]}
                  onPress={onClose}
                >
                  <Text style={styles.cancelText}>{cancelText}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.confirm]}
                  onPress={onConfirm}
                >
                  <Text style={styles.confirmText}>{confirmText}</Text>
                </TouchableOpacity>
              </>
            ) : (
              <View className="flex w-[100%]">
              <Button
                onPress={onClose}
              >
                <Typo style={styles.confirmText}>{confirmText}</Typo>
              </Button>
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "80%",
    backgroundColor: colors.neutral500,
    borderRadius: 15,
    padding: 20,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    color: colors.black
  },
  message: {
    fontSize: 16,
    color: colors.textLighter,
    marginBottom: 20,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "100%"
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  cancel: {
    marginRight: 10,
    backgroundColor: "#eee",
  },
  confirm: {
    backgroundColor: "#007bff",
  },
  cancelText: {
    color: "#333",
    fontWeight: "600",
  },
  confirmText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default CustomAlert;
