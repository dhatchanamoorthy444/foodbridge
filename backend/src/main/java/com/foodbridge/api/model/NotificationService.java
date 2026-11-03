package com.foodbridge.api.model;

import java.util.List;

// Interface for notification service (Abstraction example)
public interface NotificationService {
    void sendNotification(User recipient, String message);
    String getNotificationType();
    boolean isPriority();
    void markAsRead();
    boolean isRead();
    String getMessage();
    void setMessage(String message);
}

// Abstract notification service implementation
public abstract class AbstractNotificationService implements NotificationService {
    protected String message;
    protected boolean isRead;
    protected User recipient;

    public AbstractNotificationService(User recipient) {
        this.recipient = recipient;
        this.isRead = false;
    }

    @Override
    public void sendNotification(User recipient, String message) {
        this.recipient = recipient;
        this.message = message;
        sendActualNotification(recipient, message);
    }

    protected abstract void sendActualNotification(User recipient, String message);

    @Override
    public String getNotificationType() {
        return this.getClass().getSimpleName();
    }

    @Override
    public boolean isPriority() {
        return false;
    }

    @Override
    public void markAsRead() {
        this.isRead = true;
    }

    @Override
    public boolean isRead() {
        return this.isRead;
    }

    @Override
    public String getMessage() {
        return this.message;
    }

    @Override
    public void setMessage(String message) {
        this.message = message;
    }
}

// Email notification service (Concrete implementation - Runtime polymorphism)
public class EmailNotificationService extends AbstractNotificationService {
    private String emailAddress;

    public EmailNotificationService(User recipient, String emailAddress) {
        super(recipient);
        this.emailAddress = emailAddress;
    }

    @Override
    protected void sendActualNotification(User recipient, String message) {
        System.out.println("Sending email to " + emailAddress + ": " + message);
        // In real implementation: use JavaMailSender to send email
    }

    @Override
    public boolean isPriority() {
        return true; // Email notifications are high priority
    }

    @Override
    public String getNotificationType() {
        return "EMAIL";
    }
}

// SMS notification service (Concrete implementation - Runtime polymorphism)
public class SMSNotificationService extends AbstractNotificationService {
    private String phoneNumber;

    public SMSNotificationService(User recipient, String phoneNumber) {
        super(recipient);
        this.phoneNumber = phoneNumber;
    }

    @Override
    protected void sendActualNotification(User recipient, String message) {
        System.out.println("Sending SMS to " + phoneNumber + ": " + message);
        // In real implementation: use Twilio or similar service
    }

    @Override
    public String getNotificationType() {
        return "SMS";
    }
}

// In-app notification service (Concrete implementation - Runtime polymorphism)
public class InAppNotificationService extends AbstractNotificationService {
    private String notificationId;

    public InAppNotificationService(User recipient, String notificationId) {
        super(recipient);
        this.notificationId = notificationId;
    }

    @Override
    protected void sendActualNotification(User recipient, String message) {
        System.out.println("Sending in-app notification to user " + recipient.getId() + ": " + message);
        // In real implementation: save to database and push to frontend via WebSocket
    }

    @Override
    public String getNotificationType() {
        return "IN_APP";
    }
}

// Notification factory class (Factory pattern)
public class NotificationFactory {
    public static NotificationService createNotification(User recipient, String type, String contactInfo) {
        switch (type.toUpperCase()) {
            case "EMAIL":
                return new EmailNotificationService(recipient, contactInfo);
            case "SMS":
                return new SMSNotificationService(recipient, contactInfo);
            case "IN_APP":
                return new InAppNotificationService(recipient, "NOTIF_" + System.currentTimeMillis());
            default:
                throw new IllegalArgumentException("Unknown notification type: " + type);
        }
    }
}

// Role-specific notification service implementations (Method overriding)
public class DonorNotificationService extends AbstractNotificationService {
    public DonorNotificationService(User recipient) {
        super(recipient);
    }

    @Override
    protected void sendActualNotification(User recipient, String message) {
        System.out.println("DONOR NOTIFICATION: " + message);
        // Send donor-specific notification logic
    }

    @Override
    public boolean isPriority() {
        return true;
    }

    @Override
    public String getNotificationType() {
        return "DONOR_SPECIFIC";
    }
}

public class RecipientNotificationService extends AbstractNotificationService {
    public RecipientNotificationService(User recipient) {
        super(recipient);
    }

    @Override
    protected void sendActualNotification(User recipient, String message) {
        System.out.println("RECIPIENT NOTIFICATION: " + message);
        // Send recipient-specific notification logic
    }

    @Override
    public String getNotificationType() {
        return "RECIPIENT_SPECIFIC";
    }
}

public class VolunteerNotificationService extends AbstractNotificationService {
    public VolunteerNotificationService(User recipient) {
        super(recipient);
    }

    @Override
    protected void sendActualNotification(User recipient, String message) {
        System.out.println("VOLUNTEER NOTIFICATION: " + message);
        // Send volunteer-specific notification logic
    }

    @Override
    public String getNotificationType() {
        return "VOLUNTEER_SPECIFIC";
    }
}

public class AdminNotificationService extends AbstractNotificationService {
    public AdminNotificationService(User recipient) {
        super(recipient);
    }

    @Override
    protected void sendActualNotification(User recipient, String message) {
        System.out.println("ADMIN NOTIFICATION: " + message);
        // Send admin-specific notification logic
    }

    @Override
    public boolean isPriority() {
        return true;
    }

    @Override
    public String getNotificationType() {
        return "ADMIN_SPECIFIC";
    }
}

// Notification service manager (Demonstrates composition)
public class NotificationManager {
    private List<NotificationService> notifications;

    public NotificationManager() {
        this.notifications = new java.util.ArrayList<>();
    }

    public void addNotification(NotificationService notification) {
        notifications.add(notification);
    }

    public void sendAllNotifications(User recipient, String message) {
        for (NotificationService notification : notifications) {
            notification.sendNotification(recipient, message);
        }
    }

    public void markAllAsRead() {
        for (NotificationService notification : notifications) {
            notification.markAsRead();
        }
    }

    public long getUnreadCount() {
        return notifications.stream()
            .filter(notification -> !notification.isRead())
            .count();
    }
}