export interface CertificationType {
    name: string;
    authority: string;
    image: string;
    issued: string;
};

export interface CertificationPropType {
    certifications: CertificationType[];
}
