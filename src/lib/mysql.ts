import mysql from 'mysql2/promise';

interface MySQLConfig {
  host: string;
  user: string;
  password: string;
  database: string;
  port?: number;
}

class MySQLDatabase {
  private pool: mysql.Pool;

  constructor(config: MySQLConfig) {
    this.pool = mysql.createPool({
      host: config.host,
      user: config.user,
      password: config.password,
      database: config.database,
      port: config.port || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      acquireTimeout: 60000,
      timeout: 60000,
    });
  }

  async query(sql: string, params?: any[]): Promise<any> {
    try {
      const [rows] = await this.pool.execute(sql, params);
      return rows;
    } catch (error) {
      console.error('MySQL Query Error:', error);
      throw error;
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
  }

  // News operations
  async getNews(): Promise<any[]> {
    return this.query('SELECT * FROM news WHERE status = ? ORDER BY created_at DESC', ['published']);
  }

  async addNews(news: any): Promise<any> {
    const sql = `
      INSERT INTO news (title, excerpt, content, image, author, status, date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [news.title, news.excerpt, news.content, news.image, news.author, news.status, news.date];
    return this.query(sql, params);
  }

  async updateNews(id: string, news: any): Promise<any> {
    const sql = `
      UPDATE news 
      SET title = ?, excerpt = ?, content = ?, image = ?, author = ?, status = ?, updated_at = NOW()
      WHERE id = ?
    `;
    const params = [news.title, news.excerpt, news.content, news.image, news.author, news.status, id];
    return this.query(sql, params);
  }

  async deleteNews(id: string): Promise<any> {
    return this.query('DELETE FROM news WHERE id = ?', [id]);
  }

  // Services operations
  async getServices(): Promise<any[]> {
    return this.query('SELECT * FROM services WHERE status = ? ORDER BY created_at DESC', ['active']);
  }

  async addService(service: any): Promise<any> {
    const sql = `
      INSERT INTO services (title, description, icon, tags, status)
      VALUES (?, ?, ?, ?, ?)
    `;
    const params = [service.title, service.description, service.icon, JSON.stringify(service.tags), service.status];
    return this.query(sql, params);
  }

  async updateService(id: string, service: any): Promise<any> {
    const sql = `
      UPDATE services 
      SET title = ?, description = ?, icon = ?, tags = ?, status = ?, updated_at = NOW()
      WHERE id = ?
    `;
    const params = [service.title, service.description, service.icon, JSON.stringify(service.tags), service.status, id];
    return this.query(sql, params);
  }

  async deleteService(id: string): Promise<any> {
    return this.query('DELETE FROM services WHERE id = ?', [id]);
  }

  // Incident reports operations
  async getIncidentReports(): Promise<any[]> {
    return this.query('SELECT * FROM incident_reports ORDER BY date_reported DESC');
  }

  async addIncidentReport(incident: any): Promise<any> {
    const referenceNumber = `RD-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0')}`;
    const sql = `
      INSERT INTO incident_reports (reference_number, reporter_name, contact_number, location, incident_type, description, urgency, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [referenceNumber, incident.reporter_name, incident.contact_number, incident.location, incident.incident_type, incident.description, incident.urgency, incident.status];
    return this.query(sql, params);
  }

  async updateIncidentReport(id: string, incident: any): Promise<any> {
    const sql = `
      UPDATE incident_reports 
      SET status = ?, updated_at = NOW()
      WHERE id = ?
    `;
    const params = [incident.status, id];
    return this.query(sql, params);
  }

  async deleteIncidentReport(id: string): Promise<any> {
    return this.query('DELETE FROM incident_reports WHERE id = ?', [id]);
  }

  // Gallery operations
  async getGallery(): Promise<any[]> {
    return this.query('SELECT * FROM gallery WHERE status = ? ORDER BY created_at DESC', ['published']);
  }

  async addGalleryItem(item: any): Promise<any> {
    const sql = `
      INSERT INTO gallery (title, description, image, category, date, location, tags, status, featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [item.title, item.description, item.image, item.category, item.date, item.location, JSON.stringify(item.tags), item.status, item.featured];
    return this.query(sql, params);
  }

  async updateGalleryItem(id: string, item: any): Promise<any> {
    const sql = `
      UPDATE gallery 
      SET title = ?, description = ?, image = ?, category = ?, date = ?, location = ?, tags = ?, status = ?, featured = ?, updated_at = NOW()
      WHERE id = ?
    `;
    const params = [item.title, item.description, item.image, item.category, item.date, item.location, JSON.stringify(item.tags), item.status, item.featured, id];
    return this.query(sql, params);
  }

  async deleteGalleryItem(id: string): Promise<any> {
    return this.query('DELETE FROM gallery WHERE id = ?', [id]);
  }
}

export default MySQLDatabase;